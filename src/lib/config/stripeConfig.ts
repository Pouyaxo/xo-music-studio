export const STRIPE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
  successUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com/checkout/success'
    : 'https://localhost:3001/checkout/success',
  cancelUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com/checkout/cancel'
    : 'https://localhost:3001/checkout/cancel',
}; 