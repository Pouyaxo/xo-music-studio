"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "../forms/CheckoutPage";
import convertToSubcurrency from "@/lib/utils/convertToSubCurrency";
import { Lock, X } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { LicenseModal } from "@/components/licenses/modal";
import { getStripe } from "@/lib/stripe";

const stripePromise = getStripe();

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  productType: "beat" | "sound_kit" | "studio" | "mixing" | "mastering";
}

export function StripeModal({
  isOpen,
  onClose,
  amount,
  productType,
}: StripeModalProps) {
  const { items } = useCart();

  if (!isOpen) return null;

  const stripeOptions = {
    mode: "payment" as const,
    amount: convertToSubcurrency(amount),
    currency: "usd",
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#000000",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          borderRadius: "9999px",
          padding: "12px 16px",
        },
        ".Input:focus": {
          borderColor: "#000000",
        },
        ".Tab": {
          borderRadius: "4px",
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="w-full max-w-[460px] bg-white rounded-[20px] shadow-2xl mx-4">
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-[20px] border-b border-gray-100 z-10">
            <div className="p-6 flex justify-between items-center">
              <div className="w-full text-center">
                <h2 className="text-2xl font-bold text-black">
                  Secure Checkout
                </h2>
              </div>
              <button
                onClick={onClose}
                className="absolute right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Total Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-black">Total</span>
                <span className="text-2xl font-bold text-black">
                  ${amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6">
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutPage
                amount={amount}
                title={
                  items.length === 1
                    ? items[0].track?.title ?? "Untitled Track"
                    : `${items.length} items`
                }
                type={productType}
              />
            </Elements>
          </div>

          {/* Footer */}
          <div className="p-4 flex items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 rounded-b-[20px]">
            <Lock className="w-4 h-4 text-[#30D158]" />
            <span className="text-sm text-gray-600">Secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
