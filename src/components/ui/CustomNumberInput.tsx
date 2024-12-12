"use client";
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CustomNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}
export function CustomNumberInput({
  label,
  error,
  className,
  containerClassName,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  ...props
}: CustomNumberInputProps) {
  const increment = () => {
    if (disabled) return;
    const currentValue = parseFloat(value as string) || 0;
    const maxValue = max ? parseFloat(max as string) : Infinity;
    const stepValue = parseFloat(step as string);
    const newValue = Math.min(currentValue + stepValue, maxValue);

    const event = {
      target: {
        value: newValue.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(event);
  };
  const decrement = () => {
    if (disabled) return;
    const currentValue = parseFloat(value as string) || 0;
    const minValue = min ? parseFloat(min as string) : -Infinity;
    const stepValue = parseFloat(step as string);
    const newValue = Math.max(currentValue - stepValue, minValue);

    const event = {
      target: {
        value: newValue.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(event);
  };
  return (
    <div className={cn("relative", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={onChange}
          className={cn(
            "w-full h-9 bg-zinc-900/50 border border-white/10 rounded-lg pl-3 pr-8 text-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "appearance-none",
            "[&::-webkit-inner-spin-button]:appearance-none",
            "[&::-webkit-outer-spin-button]:appearance-none",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          {...props}
        />
        <div className="absolute right-2 inset-y-0 flex flex-col justify-center -space-y-[2px]">
          <button
            type="button"
            onClick={increment}
            disabled={disabled || (max !== undefined && parseFloat(value as string) >= parseFloat(max as string))}
            className="h-3 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || (min !== undefined && parseFloat(value as string) <= parseFloat(min as string))}
            className="h-3 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}