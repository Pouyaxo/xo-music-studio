"use client";

import React from 'react';
import { CartItem } from './CartItem';
import type { CartItem as CartItemType } from '@/lib/types/commerceTypes';

interface CartContentProps {
  items: CartItemType[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartContent = React.memo(function CartContent({ 
  items, 
  onRemove,
  onCheckout,
  onContinueShopping
}: CartContentProps) {
  return (
    <>
      <h3 className="text-lg font-bold mb-4">YOUR CART ({items.length}):</h3>
      
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={onRemove}
        />
      ))}

      {items.length > 0 ? (
        <div className="mt-4">
          <button 
            onClick={onCheckout}
            className="w-full bg-white text-black py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            PROCEED TO CHECKOUT
          </button>
          <button 
            onClick={onContinueShopping}
            className="w-full text-center mt-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-400">Your cart is empty</p>
      )}
    </>
  );
});