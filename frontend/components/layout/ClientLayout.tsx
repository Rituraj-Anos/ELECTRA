"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSessionStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOnboarded } = useSessionStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isOnboarded && pathname !== "/onboard") {
      router.push("/onboard");
    }
  }, [mounted, isOnboarded, pathname, router]);

  if (!mounted) return null;

  /* Onboarding gets a bare shell — no navbar/footer */
  if (pathname === "/onboard") {
    return (
      <main id="main-content" style={{ minHeight: "100vh" }}>
        {children}
      </main>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          id="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            flex: 1,
            paddingTop: 72, /* offset for fixed navbar */
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {pathname !== "/chat" && <Footer />}
    </div>
  );
}
