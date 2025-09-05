// Main app navigation header
// Following the blueprint component architecture

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <header className="border-b border-border bg-background relative z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 -ml-2 text-foreground/60 hover:text-foreground hover:bg-accent rounded-md transition-colors md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="HueJitsu Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-foreground">hueJitsu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/create"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Create
            </Link>
            <Link
              href="/pricing"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* User section */}
          <div className="flex items-center space-x-4">
            {/* TODO: Add user profile dropdown */}
            <div className="text-sm text-foreground/60 hidden sm:block">
              User Profile
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
