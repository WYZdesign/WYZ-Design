"use client";

// Extracted from src/app/layout.tsx so the admin dashboard can skip the
// public marketing chrome (Navbar + Footer + CartButton) entirely. Before
// this, /admin had no layout.tsx of its own, so it fell through to
// RootLayout and got the full public Navbar stacked above its own header
// and the full public Footer (newsletter signup, social links, sitemap)
// stacked below its own content - wasted a large chunk of vertical space on
// mobile and was confusing (two unrelated nav systems visible at once) on
// a page that already has its own sidebar nav and header. usePathname()
// needs a client component, which RootLayout (a server component) can't be,
// so this one small wrapper takes over rendering the chrome conditionally.
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartButton from "@/components/CartButton";
import ScrollToTop from "@/components/ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin has its own header, sidebar nav, and loading/error boundaries
    // (src/app/admin/{page,loading,error}.tsx) - no top padding needed since
    // there's no fixed public Navbar to clear, and no public Footer/CartButton.
    return (
      <div id="main-content" className="flex-1 bg-white dark:bg-[#1C1C1E]" tabIndex={-1}>
        {children}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <div id="main-content" className="flex-1 pt-16 lg:pt-20 bg-white dark:bg-[#1C1C1E]" tabIndex={-1}>
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
        <ScrollToTop />
      </ErrorBoundary>
      <CartButton />
    </>
  );
}
