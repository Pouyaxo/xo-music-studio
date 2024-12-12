// src/app/signup/page.tsx
"use client";

import { SignupPanel } from "@/components/auth/SignupPanel";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignupPanel />
    </div>
  );
}
