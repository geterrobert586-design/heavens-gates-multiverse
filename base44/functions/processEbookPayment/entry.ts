import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized - User not authenticated' }, { status: 401 });
    }

    const { session_id } = await req.json();

    if (!session_id) {
      return Response.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const metadata = session.metadata;
    const bookId = metadata.book_id;
    const bookTitle = metadata.book_title;
    const ebookFormat = metadata.ebook_format;
    const pricePaid = parseFloat(metadata.price || session.amount_total / 100);
    const ownerEmail = metadata.owner_email;
    const ownerName = metadata.owner_name;

    // Verify user email matches the purchase owner email
    if (user.email !== ownerEmail) {
      return Response.json({ error: 'Unauthorized - Email mismatch' }, { status: 403 });
    }

    // Get book details to retrieve ebook file URL
    const book = await base44.entities.Book.get(bookId);
    if (!book || !book.ebook_file_url) {
      return Response.json({ error: 'Ebook file not available' }, { status: 404 });
    }

    // Create BookPurchase record
    const purchaseRecord = await base44.entities.BookPurchase.create({
      book_id: bookId,
      book_title: bookTitle,
      ebook_format: ebookFormat,
      price_paid: pricePaid,
      purchase_date: new Date().toISOString(),
      ebook_file_url: book.ebook_file_url,
      stripe_payment_intent_id: session.payment_intent,
      owner_name: ownerName,
      owner_email: ownerEmail,
    });

    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: ownerEmail,
      subject: `Ebook Purchase - ${bookTitle}`,
      body: `Thank you for your purchase!\n\nOrder Details:\n- Book: ${bookTitle}\n- Format: ${ebookFormat.toUpperCase()}\n- Amount Paid: $${pricePaid.toFixed(2)}\n\nDownload your ebook: ${book.ebook_file_url}\n\nEnjoy your reading!\n\n© Robert Leon Geter II, LLC`,
    });

    return Response.json({ 
      success: true, 
      purchaseId: purchaseRecord.id,
      ebookUrl: book.ebook_file_url
    });
  } catch (error) {
    console.error('Process ebook payment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});