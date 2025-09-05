// Dashboard layout wrapper for authenticated pages
// Following the blueprint component architecture

import { Header } from "./Header";
import { Footer } from "./Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function DashboardLayout({
  children,
  showFooter = false,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col min-h-0 w-full overflow-hidden">
        <div className="flex-1 w-full max-w-full">{children}</div>
      </main>

      {/* Footer (optional for dashboard pages) */}
      {showFooter && <Footer />}
    </div>
  );
}
