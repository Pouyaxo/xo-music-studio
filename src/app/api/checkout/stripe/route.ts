import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Add debug logging
console.log('API Route loaded, STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    console.log('Starting Stripe payment intent creation');
    
    const { amount } = await request.json();
    console.log('Amount received:', amount);

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe API Error:', error);
    // Return more detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
