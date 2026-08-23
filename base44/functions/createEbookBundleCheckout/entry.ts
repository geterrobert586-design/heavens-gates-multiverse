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

    const { bookIds, totalPrice } = await req.json();

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return Response.json({ error: 'Invalid book IDs' }, { status: 400 });
    }

    // Fetch all books in the bundle
    const allBooks = await base44.entities.Book.list();
    const bundleBooks = allBooks.filter(book => bookIds.includes(book.id));

    if (bundleBooks.length === 0) {
      return Response.json({ error: 'No valid books found' }, { status: 400 });
    }

    // Create line items for each book
    const line_items = bundleBooks.map(book => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: book.title,
          description: `Book ${book.book_number} - ${book.ebook_format || 'PDF'} Edition`,
        },
        unit_amount: Math.round((book.ebook_price || 9.99) * 100),
      },
      quantity: 1,
    }));

    // Calculate total and discount
    const originalTotal = bundleBooks.reduce((sum, book) => sum + (book.ebook_price || 9.99), 0);
    const discountAmount = originalTotal - (totalPrice || 25.00);

    // Add discount as a negative line item if applicable
    if (discountAmount > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Bundle Discount',
            description: `Save $${discountAmount.toFixed(2)} on the complete trilogy`,
          },
          unit_amount: -Math.round(discountAmount * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/books/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/books`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        bundle_type: 'ebook_trilogy',
        book_ids: bookIds.join(','),
        owner_email: user.email,
      },
    });

    console.log('Bundle checkout session created:', session.id);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Bundle checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});