"use client";

import { useUIStore, useSessionStore } from "@/lib/store";
import { COUNTRIES } from "@/lib/types";

export default function Header() {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { country, language } = useSessionStore();

  const countryData = COUNTRIES.find((c) => c.code === country);

  return (
    <header style={{
      height: 56, background: "var(--navy-mid)",
      borderBottom: "1px solid var(--border-dim)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 var(--sp-md)", position: "sticky", top: 0, zIndex: 30,
    }}>
      {/* Left: hamburger */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "var(--sp-xs)", borderRadius: "var(--r-md)",
          color: "var(--text-secondary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "color var(--dur-fast) var(--ease-out)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Right: context chips */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-xs)" }}>
        <Chip label="Region" value={countryData ? `${countryData.flag} ${countryData.name}` : "Global"} />
        <Chip label="Lang" value={language?.toUpperCase() || "EN"} />
      </div>
    </header>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: "var(--surface)", border: "1px solid var(--border-dim)",
      borderRadius: "var(--r-pill)", padding: "4px 12px",
      fontSize: "var(--text-xs)",
    }}>
      <span style={{ color: "var(--text-tertiary)" }}>{label}:</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
