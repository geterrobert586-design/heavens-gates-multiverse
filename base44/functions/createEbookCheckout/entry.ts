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

    const { bookId, bookTitle, ebookFormat, price } = await req.json();

    if (!bookId || !bookTitle || !price) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${bookTitle} (${ebookFormat.toUpperCase()})`,
              description: 'Digital Ebook Download',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/books/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/books`,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        book_id: bookId,
        book_title: bookTitle,
        ebook_format: ebookFormat,
        price: price.toString(),
        owner_email: user.email,
        owner_name: user.full_name,
      },
      customer_email: user.email,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Create ebook checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});