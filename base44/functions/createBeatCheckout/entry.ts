import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.0.0';
import { jsPDF } from 'npm:jspdf@4.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { beatId, beatTitle, licenseType, price, email } = await req.json();

    if (!beatId || !licenseType || !price || !email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Urban Guerilla Beats - ${beatTitle}`,
              description: `${licenseType.toUpperCase()} License`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/beats/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/beats`,
      customer_email: email,
      metadata: {
        beat_id: beatId,
        beat_title: beatTitle,
        license_type: licenseType,
        owner_email: email,
        owner_name: user.full_name,
      },
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});