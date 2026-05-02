"use client";

import Link from "next/link";

const PAGE_LINKS = [
  { name: "Dashboard", href: "/" },
  { name: "Learn", href: "/learn" },
  { name: "AI Chat", href: "/chat" },
  { name: "Timeline", href: "/timeline" },
  { name: "Glossary", href: "/glossary" },
  { name: "Polling", href: "/polling" },
];

const RESOURCES = [
  { name: "Voter Registration", href: "/learn" },
  { name: "Election Process", href: "/learn" },
  { name: "Civic Glossary", href: "/glossary" },
  { name: "Ask ELECTRA", href: "/chat" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-white)",
        borderTop: "1px solid var(--border-light)",
        padding: "var(--sp-3xl) 0 var(--sp-xl)",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: "var(--sp-xl)",
        }}
      >
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--sp-sm)" }}>
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
              }}
            >
              E
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--text-heading)",
                letterSpacing: "-0.02em",
              }}
            >
              ELECTRA
            </span>
          </div>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              maxWidth: "28ch",
              lineHeight: 1.6,
            }}
          >
            AI-powered civic education platform helping citizens understand elections and democratic processes.
          </p>
          {/* Social icons */}
          <div style={{ display: "flex", gap: 12, marginTop: "var(--sp-md)" }}>
            {["GitHub", "Twitter", "LinkedIn"].map((label) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  transition: "all var(--dur-fast) var(--ease-out)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {label === "GitHub" && <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />}
                  {label === "Twitter" && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                  {label === "LinkedIn" && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Pages column */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "var(--text-heading)",
              marginBottom: "var(--sp-sm)",
              letterSpacing: "-0.01em",
            }}
          >
            Pages
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.href + link.name}
                href={link.href}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color var(--dur-fast) var(--ease-out)",
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources column */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "var(--text-heading)",
              marginBottom: "var(--sp-sm)",
              letterSpacing: "-0.01em",
            }}
          >
            Resources
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RESOURCES.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color var(--dur-fast) var(--ease-out)",
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact column */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "var(--text-heading)",
              marginBottom: "var(--sp-sm)",
              letterSpacing: "-0.01em",
            }}
          >
            Built For
          </h4>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Google Antigravity Hackathon 2026
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
            Powered by Google Gemini AI
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="container"
        style={{
          marginTop: "var(--sp-xl)",
          paddingTop: "var(--sp-md)",
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "var(--text-xs)",
          color: "var(--text-tertiary)",
        }}
      >
        <span>© 2026 ELECTRA. Built for the Google Antigravity Hackathon.</span>
        <span>Powered by Google Gemini</span>
      </div>

      {/* Responsive footer */}
      <style jsx global>{`
        @media (max-width: 768px) {
          footer .container {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .container {
            grid-template-columns: 1fr !important;
          }
          footer .container > div:last-child {
            flex-direction: column !important;
          }
        }
      `}</style>
    </footer>
  );
}
