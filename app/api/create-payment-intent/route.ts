import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';
  return new Stripe(key, {
    apiVersion: '2025-03-31.basil',
  });
};

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
    }
    const stripe = getStripe();
    const { amount, email } = await req.json();
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: email,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 });
  }
}
