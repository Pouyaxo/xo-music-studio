"use client";

import { useState } from "react";

export function ContactForm() {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Add your form submission logic here
    setTimeout(() => setSending(false), 2000);
  };

  return (
    <div className="w-full bg-black py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Get in touch with us for any questions or support
          </p>
        </div>

        {/* Form Container with consistent width */}
        <div className="max-w-[1200px] mx-auto">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="border border-white/10 rounded-lg p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="E-MAIL ADDRESS"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <input
                type="text"
                placeholder="SUBJECT"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                required
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                placeholder="MESSAGE"
                rows={6}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={sending}
                className="bg-white hover:bg-neutral-200 text-black text-sm font-medium px-8 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
