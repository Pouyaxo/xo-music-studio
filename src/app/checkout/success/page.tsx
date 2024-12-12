"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const payment_intent = searchParams.get("payment_intent");
        if (!payment_intent) throw new Error("No payment intent found");

        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentIntentId: payment_intent }),
        });

        if (!response.ok) throw new Error("Payment verification failed");

        clearCart();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Payment verification failed"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Processing your payment...
          </h1>
          <p>Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/checkout" className="text-blue-500 hover:underline">
            Return to checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Thank you for your purchase!
        </h1>
        <p className="mb-8">Your payment has been processed successfully.</p>
        <div className="space-y-4">
          <Link
            href="/downloads"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Download Your Files
          </Link>
          <Link href="/" className="block text-gray-400 hover:text-white">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
