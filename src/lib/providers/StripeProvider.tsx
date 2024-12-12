"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
  betas: ["payment_element_beta_1"],
  apiVersion: "2023-10-16",
});

export function StripeProvider({ children }: { children: ReactNode }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        currency: "usd",
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#000000",
            fontFamily: "system-ui, sans-serif",
            fontSizeBase: "11px",
            spacingUnit: "2px",
            borderRadius: "8px",
          },
          rules: {
            ".Input": {
              padding: "4px 8px",
              height: "28px",
            },
            ".Label": {
              marginBottom: "1px",
              fontSize: "10px",
            },
            ".Error": {
              marginTop: "1px",
              fontSize: "9px",
            },
            ".Tab": {
              padding: "4px 6px",
              border: "none",
            },
            ".Block": {
              marginBottom: "1px",
            },
            ".Container": {
              padding: "2px",
            },
            ".PaymentMethodSelector": {
              marginBottom: "2px",
            },
            ".Form": {
              gap: "1px",
            },
            ".Text": {
              fontSize: "10px",
            },
            ".Section": {
              marginBottom: "2px",
            },
          },
        },
        loader: "auto",
        paymentMethodTypes: ["card", "paypal"],
      }}
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        style={{ position: "fixed", height: "100vh" }}
      >
        <div
          className="w-full max-w-[320px] bg-[#111111] rounded-[20px] shadow-xl m-4"
          style={{
            maxHeight: "460px",
            transform: "scale(0.95)",
          }}
        >
          <div className="p-3">
            <div className="space-y-2">{children}</div>
          </div>
        </div>
      </div>
    </Elements>
  );
}
