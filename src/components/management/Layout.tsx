import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface ManagementLayoutProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addButtonLabel?: string;
  showAddButton?: boolean;
}

export function ManagementLayout({
  title,
  children,
  onAdd,
  addButtonLabel = "Add New",
  showAddButton = true,
}: ManagementLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {showAddButton && onAdd && (
              <Button
                onClick={onAdd}
                className="bg-white hover:bg-gray-200 text-black rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {addButtonLabel}
              </Button>
            )}
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
