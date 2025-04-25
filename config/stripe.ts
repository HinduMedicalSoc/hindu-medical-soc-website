import { loadStripe } from '@stripe/stripe-js';

export const getStripePromise = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Stripe publishable key is not defined');
  }
  return loadStripe(publishableKey);
};