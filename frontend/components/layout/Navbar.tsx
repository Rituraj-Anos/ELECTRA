"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/store";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/" },
  { name: "Learn", href: "/learn" },
  { name: "Chat", href: "/chat" },
  { name: "Timeline", href: "/timeline" },
  { name: "Glossary", href: "/glossary" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-light)" : "1px solid transparent",
        transition: "all var(--dur-base) var(--ease-out)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* E logo mark */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--r-md)",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.03em",
            }}
          >
            E
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: scrolled ? "var(--text-heading)" : "var(--text-heading)",
              letterSpacing: "-0.02em",
            }}
          >
            ELECTRA
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          className="desktop-nav"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--r-md)",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--accent)" : "var(--text-body)",
                  background: isActive ? "var(--accent-light)" : "transparent",
                  transition: "all var(--dur-fast) var(--ease-out)",
                  textDecoration: "none",
                }}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/polling"
            className="btn btn-secondary"
            style={{
              marginLeft: 8,
              padding: "9px 20px",
              fontSize: "var(--text-sm)",
              textDecoration: "none",
            }}
          >
            Find Polling
          </Link>
          <Link
            href="/chat"
            className="btn btn-primary"
            style={{
              marginLeft: 4,
              padding: "9px 20px",
              fontSize: "var(--text-sm)",
              textDecoration: "none",
            }}
          >
            Ask ELECTRA
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: "var(--text-heading)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div
          className="mobile-menu"
          style={{
            background: "white",
            borderTop: "1px solid var(--border-light)",
            padding: "var(--sp-sm)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--r-md)",
                  fontSize: "var(--text-body-md)",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--accent)" : "var(--text-body)",
                  background: isActive ? "var(--accent-light)" : "transparent",
                  textDecoration: "none",
                }}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/polling"
            style={{
              padding: "12px 16px",
              borderRadius: "var(--r-md)",
              fontSize: "var(--text-body-md)",
              fontWeight: 500,
              color: "var(--text-body)",
              textDecoration: "none",
            }}
          >
            Find Polling
          </Link>
          <Link
            href="/chat"
            className="btn btn-primary"
            style={{
              marginTop: 8,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Ask ELECTRA
          </Link>
        </div>
      )}

      {/* Responsive CSS injected inline */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
