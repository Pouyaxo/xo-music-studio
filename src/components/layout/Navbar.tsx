"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartDropdown } from "@/components/cart";
import { useRouter, usePathname } from "next/navigation";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { useAuthStore } from "@/lib/store/authStore";
import {
  Search,
  LogOut,
  Music,
  Package,
  FileText,
  User,
  ShoppingBag,
} from "lucide-react";
import { useSearchStore } from "@/lib/store/searchStore";
import { SearchBar } from "@/components/hero/SearchBar";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, initialized, loading, refreshSession } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasProfilePhoto = user?.user_metadata?.profile_photo_url;
  const profilePhotoUrl = hasProfilePhoto
    ? user.user_metadata.profile_photo_url.startsWith("http")
      ? user.user_metadata.profile_photo_url
      : getStorageUrl(user.user_metadata.profile_photo_url)
    : null;
  const { setIsOpen } = useSearchStore();
  const initialMount = useRef(true);
  const [isClient, setIsClient] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (initialized && !loading) {
      refreshSession();
    }
  }, [initialized, loading, refreshSession]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const isHomePage = pathname === "/";

    if (isHomePage) {
      // On homepage, delay the navbar mount for animation
      const timer = setTimeout(() => {
        setMounted(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // On other pages, show navbar immediately
      setMounted(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isClient) return;

    if (prevPathname.current !== pathname) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      prevPathname.current = pathname;
      return () => clearTimeout(timeout);
    }
  }, [pathname, isClient]);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setShowUserMenu(false);
  };

  if (!initialized) {
    return null;
  }

  const menuItems = [
    { href: "/tracks/manage", label: "Tracks", icon: Music },
    { href: "/soundkits/manage", label: "Sound Kits", icon: Package },
    { href: "/licenses/manage", label: "Licenses", icon: FileText },
    { href: "/account-settings", label: "Account", icon: User },
    { href: "/purchases", label: "Purchases", icon: ShoppingBag },
  ];

  return (
    <>
      {/* Loading line - completely separate from navbar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
          <div className="h-full bg-white animate-progress-line" />
        </div>
      )}

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 transform ${
          pathname === "/"
            ? mounted
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Glassy background effect */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="absolute left-8">
                <Link href="/" className="flex items-center">
                  <span className="text-[22px] font-bold text-white/90">
                    XO
                  </span>
                </Link>
              </div>

              {/* Centered Navigation Links */}
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="flex items-center justify-center gap-12">
                  <Link
                    href="/beats"
                    className="text-[15px] text-neutral-200 hover:text-white transition-colors duration-200"
                  >
                    Beats
                  </Link>
                  <Link
                    href="/membership"
                    className="text-[15px] text-neutral-200 hover:text-white transition-colors duration-200"
                  >
                    Memberships
                  </Link>
                  <Link
                    href="/soundkits"
                    className="text-[15px] text-neutral-200 hover:text-white transition-colors duration-200"
                  >
                    Sound Kits
                  </Link>
                  <Link
                    href="/contact"
                    className="text-[15px] text-neutral-200 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Right Section */}
              <div className="absolute right-8 flex items-center gap-6">
                {/* Search - Hidden on tablet */}
                <button
                  className="text-white hover:text-gray-300 hidden lg:block"
                  onClick={() => setIsOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Cart */}
                <div className="lg:block">
                  <CartDropdown />
                </div>

                {/* User Menu */}
                {user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      className="flex items-center"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <div
                        className={`w-8 h-8 relative rounded-full overflow-hidden bg-black/40 backdrop-blur-[6px] flex items-center justify-center ${
                          !profilePhotoUrl ? "border border-white/20" : ""
                        }`}
                      >
                        {profilePhotoUrl ? (
                          <Image
                            src={profilePhotoUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                          />
                        ) : (
                          <User className="w-4 h-4 text-neutral-200" />
                        )}
                      </div>
                    </button>

                    {showUserMenu && (
                      <div
                        className="absolute right-0 mt-4 w-56 bg-black rounded-lg border border-white/10 overflow-hidden"
                        style={{
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <div className="py-1">
                          {menuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="group flex items-center gap-3 px-4 py-2 text-sm text-white/90 relative"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <item.icon className="w-4 h-4" />
                              <div className="absolute inset-x-2 h-8 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className="relative z-10">
                                {item.label}
                              </span>
                            </Link>
                          ))}
                          <div className="h-px bg-[#222222] my-1" />
                          <button
                            onClick={handleLogout}
                            className="group flex items-center gap-3 w-full px-4 py-2 text-sm text-white/90 relative"
                          >
                            <LogOut className="w-4 h-4" />
                            <div className="absolute inset-x-2 h-8 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-300 text-sm font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <SearchBar />
    </>
  );
}
