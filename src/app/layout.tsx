import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/lib/context/AudioContext";
import { CartProvider } from "@/lib/context/CartContext";
import { DataProvider } from "@/lib/providers/DataProvider";
import { initializeBuckets } from "@/lib/utils/storageUtils";
import { AuthErrorBoundary } from "@/lib/auth/AuthErrorBoundary";
import { Navbar } from "@/components/layout/Navbar";
import { ClientProviders } from "@/lib/providers/ClientProviders";
import { Toaster } from "sonner";
import { TOAST_CONFIG } from "@/lib/utils/toastConfig";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XO Music Studio",
  description: "Music Platform",
  other: {
    "data-grammarly-disable": "true",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

initializeBuckets().catch(console.error);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body
        className={`${manrope.className} bg-black`}
        suppressHydrationWarning
      >
        <div className="flex flex-col min-h-screen relative">
          <DataProvider>
            <AuthErrorBoundary>
              <CartProvider>
                <AudioProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Toaster {...TOAST_CONFIG} />
                </AudioProvider>
              </CartProvider>
            </AuthErrorBoundary>
          </DataProvider>
        </div>
      </body>
    </html>
  );
}
