"use client";

import { useState, useEffect } from "react";
import { useSessionStore } from "@/lib/store";
import { fetchTimeline } from "@/lib/api";
import { COUNTRIES } from "@/lib/types";
import type { TimelineEvent } from "@/lib/types";
import { motion } from "motion/react";

const CAT_COLORS: Record<string, string> = {
  registration: "var(--info)", campaigning: "var(--accent)",
  voting: "var(--success)", counting: "#8B5CF6", certification: "#EC4899",
};

/**
 * @description Page component showing an election timeline for the user's country
 * @returns {JSX.Element} Timeline page component
 */
export default function TimelinePage() {
  const { country } = useSessionStore();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline(country || "US")
      .then((d) => setEvents(d.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [country]);

  const cd = COUNTRIES.find((c) => c.code === country);

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container" style={{ maxWidth: 760, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "var(--sp-xl)" }}>
          <span className="section-tag">Timeline</span>
          <h1 style={{ fontFamily: "var(--font-heading)", marginTop: "var(--sp-xs)" }}>Election Timeline</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--sp-xs)" }}>
            Key milestones for {cd ? `${cd.flag} ${cd.name}` : "your region"}
          </p>
        </motion.div>

        {loading ? <p style={{ color: "var(--text-tertiary)" }}>Loading...</p> : (
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: "var(--border-light)" }} />
            {events.map((ev, i) => {
              const color = CAT_COLORS[ev.category] || "var(--text-tertiary)";
              return (
                <motion.div key={ev.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: "relative", marginBottom: "var(--sp-lg)", paddingLeft: 24 }}>
                  <div style={{ position: "absolute", left: -24, top: 6, width: 14, height: 14, borderRadius: "50%", background: color, border: "3px solid var(--bg-cream)", boxShadow: `0 0 0 2px ${color}` }} />
                  <div style={{ background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: "var(--r-xl)", padding: "var(--sp-md)" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginBottom: 4 }}>{ev.dateRange}</div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h3)", color: "var(--text-heading)" }}>{ev.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: 4, lineHeight: 1.6 }}>{ev.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
