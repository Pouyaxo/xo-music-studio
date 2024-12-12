"use client";

import { useCart } from "@/lib/context/CartContext";
import Image from "next/image";
import { X } from "lucide-react";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";

export default function CheckoutPage() {
  const { items, removeFromCart, total } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {items.length === 0 ? (
        <>
          <div className="text-[12px] uppercase tracking-wider font-medium text-neutral-500 mb-2">
            <div className="grid grid-cols-[24px,48px,2fr,1fr] gap-2 px-4">
              <div></div>
              <div></div>

              <div></div>
            </div>
          </div>

          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="bg-black p-8 text-center">
              <p className="text-gray-400 text-lg">No items in cart</p>
              <p className="text-sm text-gray-500 mt-2">
                Add some items to your cart to continue checkout
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#111111] rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 bg-neutral-800 rounded overflow-hidden">
                    {item.track && (
                      <Image
                        src={getStorageUrl(item.track.cover_art || null)}
                        alt={item.track.title || "Track"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.track?.title || "Untitled Track"}
                    </h3>
                    <p className="text-sm text-gray-400">{item.licenseType}</p>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex items-center gap-4">
                    <span className="font-medium">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="bg-[#111111] rounded-lg p-6 h-fit">
            <div className="space-y-4">
              {/* Coupon Code */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="coupon"
                  className="rounded border-gray-600 bg-transparent"
                />
                <label htmlFor="coupon" className="text-sm text-gray-400">
                  I have a Coupon Code
                </label>
              </div>

              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Gross</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#30D158]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Button */}
              <PaymentMethods />

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center">
                By clicking the button you accept the product(s)
                <br />
                <a href="#" className="hover:underline">
                  License Agreement(s)
                </a>{" "}
                •{" "}
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>{" "}
                •{" "}
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
                <br />
                <a href="#" className="hover:underline">
                  Refund Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
