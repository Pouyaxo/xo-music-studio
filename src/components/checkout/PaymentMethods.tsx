"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/context/CartContext";
import { StripeModal } from "@/components/checkout/payment/StripeModal";

export function PaymentMethods() {
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const { items, total } = useCart();

  if (items.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setIsStripeModalOpen(true)}
        className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-full transition-colors"
      >
        Proceed Payment
      </button>

      <StripeModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        amount={total}
        productType="beat"
      />
    </div>
  );
}
