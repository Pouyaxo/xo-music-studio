"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function CredentialsSection() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePassword = async () => {
    try {
      setLoading(true);

      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black border border-white/10">
      <CardHeader>
        <CardTitle>Credentials</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 rounded-md 
            text-white placeholder:text-neutral-500
            focus:outline-none focus:ring-1 focus:ring-white/20
            transition duration-200 mt-2"
          />
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 rounded-md 
            text-white placeholder:text-neutral-500
            focus:outline-none focus:ring-1 focus:ring-white/20
            transition duration-200 mt-2"
          />
        </div>

        <div>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 rounded-md 
            text-white placeholder:text-neutral-500
            focus:outline-none focus:ring-1 focus:ring-white/20
            transition duration-200 mt-2"
          />
        </div>

        <Button
          onClick={updatePassword}
          disabled={loading}
          className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg rounded-full font-bold"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </CardContent>
    </Card>
  );
}
