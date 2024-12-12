"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCard } from "@/components/membership/PricingCard";

const plans = [
  {
    title: "PRO WAV PLAN",
    price: 100,
    features: [
      "5 Free WAV LEASE Downloads Monthly",
      "High-Quality WAV Files",
      "Commercial Use Rights",
      "Instant Download Access",
      "Track Progress Analytics",
      "Priority Support",
    ],
    savings: "SAVINGS OF 200$",
    description:
      "Perfect for producers who need professional-quality WAV files for their projects. Save 70% compared to individual purchases.",
  },
  {
    title: "PRO TRACKOUT PLAN",
    price: 250,
    isPopular: true,
    features: [
      "5 Free TRACKOUT Downloads Monthly",
      "Full Stem Separation",
      "Individual Track Control",
      "Commercial Use Rights",
      "Advanced Mixing Capabilities",
      "24/7 Premium Support",
    ],
    savings: "SAVINGS OF 250$",
    description:
      "Ideal for professional producers needing complete control with trackout stems. Save 50% on individual purchases.",
  },
  {
    title: "PRO UNLIMITED PLAN",
    price: 300,
    features: [
      "5 Free UNLIMITED Downloads Monthly",
      "Unrestricted Usage Rights",
      "Exclusive Content Access",
      "Priority New Releases",
      "Custom License Options",
      "Dedicated Account Manager",
    ],
    savings: "SAVINGS OF 450$",
    description:
      "The ultimate package for serious producers. Unlimited creative freedom with maximum savings of 60%.",
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Membership Plans
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Choose the perfect membership plan and unlock exclusive benefits
              for your music production journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan.title}
                title={plan.title}
                price={plan.price}
                isPopular={plan.isPopular}
                features={plan.features}
                savings={plan.savings}
                description={plan.description}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              All Plans Include
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-zinc-900 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-2">
                  Quality Guarantee
                </h3>
                <p className="text-zinc-400 text-sm">
                  Professional-grade audio files with pristine quality
                </p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-2">
                  Instant Access
                </h3>
                <p className="text-zinc-400 text-sm">
                  Download your files immediately after purchase
                </p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-2">
                  24/7 Support
                </h3>
                <p className="text-zinc-400 text-sm">
                  Get help whenever you need it with our dedicated support
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
