"use client";

import dynamic from "next/dynamic";
import { TOAST_CONFIG } from "@/lib/utils/toastConfig";
import { Toaster } from "sonner";

const SearchBar = dynamic(
  () => import("@/components/hero/SearchBar").then((mod) => mod.SearchBar),
  {
    ssr: false,
  }
);

export function ClientProviders() {
  return (
    <>
      <SearchBar />
      <Toaster {...TOAST_CONFIG} />
    </>
  );
}
