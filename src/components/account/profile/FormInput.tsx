"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-black border border-white/10 rounded-md 
        text-white placeholder:text-neutral-500
        focus:outline-none focus:ring-1 focus:ring-white/20
        transition duration-200"
      />
    </div>
  );
}
