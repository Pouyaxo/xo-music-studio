"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { initialize } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.error("Invalid login credentials");
        return;
      }

      // Initialize auth store to get latest user data
      await initialize();

      toast.success("Successfully logged in!");
      router.push("/");
      router.refresh(); // Force router refresh
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sign in with Google"
      );
    }
  };

  return (
    <div className="flex items-center justify-center bg-black p-6">
      <div className="bg-black p-8 rounded-lg min-w-[400px] w-full border border-zinc-700">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-bold text-white">Log In</h2>
          <p className="text-zinc-400">Access your account to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border-zinc-700 text-white w-full"
            required
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border-zinc-700 text-white w-full"
            required
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="border-t border-zinc-700 flex-grow"></div>
          <span className="text-zinc-400 px-2">or continue with</span>
          <div className="border-t border-zinc-700 flex-grow"></div>
        </div>

        {/* Alternative Login Options */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="bg-zinc-900 text-white py-2 rounded-lg hover:bg-zinc-800 transition-colors col-span-3"
          >
            Google
          </button>
        </div>

        <div className="flex items-center justify-center text-center my-4">
          <p className="text-zinc-400 text-sm">
            <Link href="/signup" className="text-white hover:underline">
              Create new account
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center text-zinc-400 text-sm mt-6">
          {/* <p>
            By logging in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p> */}
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4"></div>
      </div>
    </div>
  );
}
