"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore, useSessionStore } from "@/lib/store";

/* SVG icon components (ui-ux-pro-max: no emojis as icons, use SVG) */
function IconDashboard() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function IconBook() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function IconChat() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function IconTimeline() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function IconPin() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconGlossary() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}

const NAV_ITEMS = [
  { name: "Dashboard",        href: "/",         icon: IconDashboard },
  { name: "Learning Modules",  href: "/learn",    icon: IconBook },
  { name: "AI Assistant",      href: "/chat",     icon: IconChat },
  { name: "Election Timeline", href: "/timeline", icon: IconTimeline },
  { name: "Polling Locations",  href: "/polling",  icon: IconPin },
  { name: "Civic Glossary",    href: "/glossary", icon: IconGlossary },
];

export default function Sidebar() {
  const { isSidebarOpen } = useUIStore();
  const { knowledgeLevel, country } = useSessionStore();

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 256,
        background: "var(--navy-mid)", borderRight: "1px solid var(--border-dim)",
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: `transform var(--dur-slow) var(--ease-out)`,
        zIndex: 40, display: "flex", flexDirection: "column",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "var(--sp-md)", borderBottom: "1px solid var(--border-dim)", textAlign: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-h2)",
            fontWeight: 800, color: "var(--amber)", letterSpacing: "0.08em",
          }}>
            ELECTRA
          </span>
        </Link>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: 4 }}>
          Election Education Platform
        </p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "var(--sp-sm)", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Profile footer */}
      <div style={{ padding: "var(--sp-sm)", borderTop: "1px solid var(--border-dim)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "var(--sp-xs)",
          padding: "var(--sp-xs) var(--sp-sm)",
          background: "var(--surface)", borderRadius: "var(--r-md)",
          border: "1px solid var(--border-dim)",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "var(--amber)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--navy)", fontWeight: 700, fontSize: "var(--text-sm)",
          }}>
            {country ? country.charAt(0) : "V"}
          </div>
          <div>
            <p style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Voter Profile</p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "capitalize" }}>
              {knowledgeLevel}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ item }: { item: typeof NAV_ITEMS[number] }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      style={{
        display: "flex", alignItems: "center", gap: "var(--sp-xs)",
        padding: "10px var(--sp-sm)", borderRadius: "var(--r-md)",
        fontSize: "var(--text-sm)", fontWeight: isActive ? 600 : 400,
        color: isActive ? "var(--navy)" : "var(--text-secondary)",
        background: isActive ? "var(--amber)" : "transparent",
        transition: `all var(--dur-fast) var(--ease-out)`,
        cursor: "pointer", textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }
      }}
    >
      <Icon />
      <span>{item.name}</span>
    </Link>
  );
}
