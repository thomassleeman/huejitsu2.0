// Mobile navigation component with slide-out functionality
// Follows accessibility best practices for mobile navigation

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Don't render anything if not open (for better performance)
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile navigation panel */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-border z-50
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link
            href="/"
            className="font-bold text-xl text-foreground"
            onClick={onClose}
          >
            hueJitsu
          </Link>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-foreground/60 hover:text-foreground hover:bg-accent rounded-md transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-4 space-y-1" role="navigation">
          <Link
            href="/dashboard"
            className="flex items-center px-3 py-3 text-foreground hover:bg-accent rounded-md transition-colors"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            className="flex items-center px-3 py-3 text-foreground hover:bg-accent rounded-md transition-colors"
            onClick={onClose}
          >
            Create
          </Link>
          <Link
            href="/pricing"
            className="flex items-center px-3 py-3 text-foreground hover:bg-accent rounded-md transition-colors"
            onClick={onClose}
          >
            Pricing
          </Link>

          {/* Divider */}
          <div className="h-px bg-border my-4" />

          {/* User section */}
          <div className="px-3 py-3 text-sm text-foreground/60">
            User Profile
          </div>
        </nav>
      </div>
    </>
  );
}
