"use client";

import React from "react";
import Link from "next/link";
import { Youtube, Instagram, CloudIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] bg-black border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Section */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Store</h3>
            <nav className="space-y-2">
              <Link
                href="/beats"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Beats
              </Link>
              <Link
                href="/sound-kits"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Sound Kits
              </Link>
              <Link
                href="/memberships"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Memberships
              </Link>
              <Link
                href="/licenses"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Licenses
              </Link>
            </nav>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">About</h3>
            <nav className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                About us
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Legal</h3>
            <nav className="space-y-2">
              <Link
                href="/terms"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/licensing"
                className="block text-sm text-neutral-400 hover:text-white"
              >
                Licensing
              </Link>
            </nav>
          </div>

          {/* Subscribe Section */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Subscribe</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Subscribe to our newsletter to get updates on new beats, sound
              kits, and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#111111] text-sm text-white px-4 py-2 rounded-lg flex-1 border border-white/10"
              />
              <button className="bg-[#111111] text-sm text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Now within max-width constraint */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-400">
              © 2024 XO. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <CloudIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
