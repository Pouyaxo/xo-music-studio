"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/DropdownMenu";
import { useCart } from "@/lib/context/CartContext";
import { useRouter } from "next/navigation";
import { CartTrigger } from "./CartTrigger";
import { CartContent } from "./CartContent";
import { License } from "@/lib/types/licenseTypes";

export function CartDropdown() {
  const router = useRouter();
  const { items, total, removeFromCart } = useCart();

  const handleCheckout = React.useCallback(() => {
    router.push("/checkout");
  }, [router]);

  const handleContinueShopping = React.useCallback(() => {
    router.push("/beats");
  }, [router]);

  const handleRemoveItem = React.useCallback(
    (id: string) => {
      removeFromCart(id);
    },
    [removeFromCart]
  );

  const typedItems = items.map((item) => ({
    ...item,
    licenseType: item.licenseType as unknown as License,
  }));

  return (
    <DropdownMenu>
      <CartTrigger itemCount={items.length} total={total} />
      <DropdownMenuContent
        className="w-80 p-4 bg-black border border-[#222222] text-white shadow-lg"
        align="end"
        sideOffset={8}
      >
        <CartContent
          items={typedItems.map((item) => ({
            ...item,
            licenseType: item.licenseType.toString(),
          }))}
          onRemove={handleRemoveItem}
          onCheckout={handleCheckout}
          onContinueShopping={handleContinueShopping}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
