// lib/stripe-loader.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publicKey) {
      throw new Error("Stripe public key is not set in .env.local");
    }
    stripePromise = loadStripe(publicKey);
  }
  return stripePromise;
};