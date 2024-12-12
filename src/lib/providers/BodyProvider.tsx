"use client";

import { ReactNode } from "react";

export function BodyProvider({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return <body className={className}>{children}</body>;
}
