"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchGlossary } from "@/lib/api";
import type { GlossaryTerm } from "@/lib/types";
import { motion } from "motion/react";

/**
 * @description Page component displaying election/civic glossary terms with search
 * @returns {JSX.Element} Glossary page component
 */
export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlossary()
      .then((d) => setTerms(d.terms || []))
      .catch(() => setTerms([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return terms;
    const q = search.toLowerCase();
    return terms.filter((t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q));
  }, [terms, search]);

  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    filtered.forEach((t) => {
      const letter = t.term.charAt(0).toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container" style={{ maxWidth: 760, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "var(--sp-lg)" }}>
          <span className="section-tag">Reference</span>
          <h1 style={{ fontFamily: "var(--font-heading)", marginTop: "var(--sp-xs)" }}>Civic Glossary</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--sp-xs)" }}>
            {terms.length} election terms explained clearly
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginBottom: "var(--sp-lg)" }}>
          <input
            className="input"
            type="search"
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search glossary"
            style={{ maxWidth: 400 }}
          />
        </motion.div>

        {loading ? <p style={{ color: "var(--text-tertiary)" }}>Loading...</p> : grouped.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No matching terms found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-lg)" }}>
            {grouped.map(([letter, items]) => (
              <motion.div key={letter} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h2)", fontWeight: 800, color: "var(--accent)", marginBottom: "var(--sp-xs)" }}>
                  {letter}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xs)" }}>
                  {items.map((t) => (
                    <details key={t.id} style={{ background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: "var(--r-lg)", padding: "var(--sp-sm) var(--sp-md)", transition: "box-shadow var(--dur-fast) var(--ease-out)" }}>
                      <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "var(--text-body-md)", color: "var(--text-heading)", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {t.term}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                      </summary>
                      <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--sp-xs)", lineHeight: 1.7, maxWidth: "65ch" }}>
                        {t.definition}
                      </p>
                    </details>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
