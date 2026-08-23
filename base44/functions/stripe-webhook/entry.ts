import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.0.0';
import { jsPDF } from 'npm:jspdf@4.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return Response.json({ error: 'Missing webhook signature or secret' }, { status: 400 });
    }

    // Verify webhook signature
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Skip if not a beat purchase (no beat_id metadata)
      if (!session.metadata?.beat_id) {
        return Response.json({ received: true });
      }

      // Process will be handled by the frontend success page
      // This webhook just acknowledges receipt
      console.log(`Beat license purchase completed: ${session.metadata.beat_title}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});