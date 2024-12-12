import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Account Settings
          </h1>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
