// src/routes/stripeRoutes.ts

import { Router } from 'express';
import Stripe from 'stripe';
import { authenticateUser } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Create a Checkout Session
router.post('/create-checkout-session', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { priceId } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id.toString(),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      endpointSecret as string
    );
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // Handle successful payment
      // Update user's subscription status in your database
      console.log('Payment successful for session:', session.id);
      break;
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      // Handle subscription update
      console.log('Subscription updated:', subscription.id);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      // Handle subscription cancellation
      console.log('Subscription cancelled:', deletedSubscription.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
