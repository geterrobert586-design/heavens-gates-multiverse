import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@17.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { session_id } = await req.json();

    if (!session_id) {
      return Response.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const bookIds = session.metadata?.book_ids?.split(',') || [];
    const ownerEmail = session.metadata?.owner_email || user.email;

    // Security check: ensure the user matches the session owner
    if (ownerEmail !== user.email) {
      return Response.json({ error: 'Unauthorized - email mismatch' }, { status: 403 });
    }

    // Fetch all books in the bundle
    const allBooks = await base44.entities.Book.list();
    const bundleBooks = allBooks.filter(book => bookIds.includes(book.id));

    // Create purchase records for each book
    const purchasePromises = bundleBooks.map(async (book) => {
      const purchaseData = {
        book_id: book.id,
        book_title: book.title,
        ebook_format: book.ebook_format || 'pdf',
        price_paid: (book.ebook_price || 9.99),
        purchase_date: new Date().toISOString(),
        ebook_file_url: book.ebook_file_url,
        stripe_payment_intent_id: session.payment_intent,
        owner_name: user.full_name,
        owner_email: ownerEmail,
      };

      return base44.entities.BookPurchase.create(purchaseData);
    });

    await Promise.all(purchasePromises);

    // Send confirmation email
    const bookTitles = bundleBooks.map(b => b.title).join(', ');
    await base44.integrations.Core.SendEmail({
      to: ownerEmail,
      subject: 'Bundle Purchase Confirmation - Anu Narrative Trilogy',
      body: `Thank you for purchasing the complete Anu Narrative trilogy!\n\nBooks purchased:\n${bookTitles}\n\nYou can now download your ebooks from your library page.\n\nEnjoy the journey through the Heavens Gates saga!`,
    });

    console.log('Bundle payment processed successfully for:', ownerEmail);
    return Response.json({ 
      success: true, 
      message: 'Bundle purchase completed',
      books_count: bundleBooks.length
    });
  } catch (error) {
    console.error('Bundle payment processing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});