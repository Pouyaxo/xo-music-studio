"use client";

import React from 'react';
import { Check, Star } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  isPopular?: boolean;
  features: string[];
  savings: string;
  description: string;
}

export function PricingCard({ 
  title, 
  price, 
  isPopular, 
  features, 
  savings,
  description 
}: PricingCardProps) {
  return (
    <div className={`relative bg-gradient-to-b from-zinc-900 to-black p-8 rounded-2xl ${
      isPopular ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/20' : 'border border-zinc-800'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 fill-current" />
            MOST POPULAR
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="text-4xl font-bold text-white">${price}</span>
          <span className="text-zinc-400">/month</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-blue-500" />
            </div>
            <span className="text-zinc-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors font-medium">
          JOIN NOW
        </button>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-500">{savings}</div>
          </div>
          <p className="text-sm text-zinc-400 text-center">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}