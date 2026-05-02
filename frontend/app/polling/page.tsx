"use client";

import { useState } from "react";
import { searchPolling } from "@/lib/api";
import type { PollingLocation } from "@/lib/types";
import { motion } from "motion/react";

export default function PollingPage() {
  const [address, setAddress] = useState("");
  const [locations, setLocations] = useState<PollingLocation[]>([]);
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchPolling(address);
      setLocations(data.locations || []);
      setMapsEmbedUrl(data.mapsEmbedUrl || null);
    } catch {
      setLocations([]);
      setMapsEmbedUrl(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container" style={{ maxWidth: 760, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "var(--sp-lg)" }}>
          <span className="section-tag">Locate</span>
          <h1 style={{ fontFamily: "var(--font-heading)", marginTop: "var(--sp-xs)" }}>Find Polling Locations</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--sp-xs)" }}>
            Enter your address to find nearby voting stations
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: "flex", gap: "var(--sp-xs)", marginBottom: "var(--sp-xl)" }}>
          <input
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="123 Main St, City, State"
            aria-label="Street address"
          />
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ whiteSpace: "nowrap" }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </motion.div>

        {loading && <p style={{ color: "var(--text-tertiary)" }}>Searching nearby locations...</p>}

        {!loading && searched && locations.length === 0 && !mapsEmbedUrl && (
          <div style={{ textAlign: "center", padding: "var(--sp-xl)", color: "var(--text-secondary)", background: "var(--bg-white)", borderRadius: "var(--r-xl)", border: "1px solid var(--border-light)" }}>
            No polling locations found. Try a different address.
          </div>
        )}

        {!loading && searched && locations.length === 0 && mapsEmbedUrl && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-lg)" }}>
            <div className="card" style={{ padding: 0, overflow: "hidden", borderRadius: "var(--r-xl)", border: "1px solid var(--border-light)" }}>
              <iframe
                width="100%"
                height="450"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}&q=polling+station+near+${encodeURIComponent(address)}&zoom=14`}
              ></iframe>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", marginBottom: "var(--sp-xs)" }}>
                Visit official election websites to find your exact polling location:
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--sp-md)" }}>
                Google Maps may not have the most up-to-date specific polling stations for your precise address. Check with your official national or local election commission.
              </p>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-sm)", justifyContent: "center" }}>
                <a href="https://www.vote.org/polling-place-locator/" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "var(--bg-cream)", color: "var(--text-primary)", border: "1px solid var(--border-light)" }}>
                  🇺🇸 vote.org (US)
                </a>
                <a href="https://www.elections.ca/" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "var(--bg-cream)", color: "var(--text-primary)", border: "1px solid var(--border-light)" }}>
                  🇨🇦 elections.ca (Canada)
                </a>
                <a href="https://www.electoralcommission.org.uk/" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "var(--bg-cream)", color: "var(--text-primary)", border: "1px solid var(--border-light)" }}>
                  🇬🇧 electoralcommission.org.uk (UK)
                </a>
                <a href="https://eci.gov.in/" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "var(--bg-cream)", color: "var(--text-primary)", border: "1px solid var(--border-light)" }}>
                  🇮🇳 eci.gov.in (India)
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {locations.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-sm)" }}>
            {locations.map((loc, i) => (
              <motion.div key={loc.id || i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } }}>
                <div className="card" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--sp-md)", alignItems: "start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--r-lg)", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-heading)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>{loc.name}</strong>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 2 }}>{loc.address}</p>
                    {loc.hours && (
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: 4 }}>Hours: {loc.hours}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
