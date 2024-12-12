"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import * as RadixDialog from "@radix-ui/react-dialog";
import {
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";

export function SignupPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="bg-zinc-900 p-8 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-bold text-white">Create an Account</h2>
          <p className="text-zinc-400">Join us and start exploring!</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="border-t border-zinc-700 flex-grow"></div>
          <span className="text-zinc-400 px-2">or continue with</span>
          <div className="border-t border-zinc-700 flex-grow"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={handleGoogleSignIn}
            className="bg-zinc-800 text-white py-2 rounded-lg hover:bg-zinc-700 col-span-3"
          >
            Google
          </button>
        </div>

        {/* Footer Links */}
        <div className="text-center text-zinc-400 text-sm mt-6">
          <p>
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-zinc-400 text-sm">Already have an account?</p>
          <Button 
            onClick={() => router.push("/login")}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
