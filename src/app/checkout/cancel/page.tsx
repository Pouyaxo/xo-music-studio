"use client";

import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
        <p className="mb-8">Your payment was cancelled. No charges were made.</p>
        <div className="space-y-4">
          <Link
            href="/checkout"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Checkout
          </Link>
          <Link
            href="/"
            className="block text-gray-400 hover:text-white"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}