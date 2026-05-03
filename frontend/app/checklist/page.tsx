"use client";

import { useState, useEffect } from "react";
import { useSessionStore } from "@/lib/store";
import { fetchChecklist, updateChecklist } from "@/lib/api";
import { motion } from "motion/react";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: string;
  icon: string;
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

/**
 * @description Page component for voter readiness checklist tracking
 * @returns {JSX.Element} Checklist page component
 */
export default function ChecklistPage() {
  const { sessionId } = useSessionStore();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const userId = sessionId || "anon";

  useEffect(() => {
    fetchChecklist(userId)
      .then((data) => {
        setItems(data.items || []);
        setProgress(data.progress || { completed: 0, total: 0, percentage: 0 });
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [userId]);

  /**
   * @description Toggles the completion state of a checklist item
   * @param {string} itemId - The ID of the checklist item to toggle
   * @returns {Promise<void>}
   */
  async function handleToggle(itemId: string) {
    try {
      const res = await updateChecklist(userId, itemId);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, completed: res.item.completed } : i))
      );
      setProgress(res.progress);
    } catch {
      // Optimistic toggle on error
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, completed: !i.completed } : i))
      );
    }
  }

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container" style={{ maxWidth: 760, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: "var(--sp-xl)" }}>
          <span className="section-tag">Prepare</span>
          <h1 style={{ fontFamily: "var(--font-heading)", marginTop: "var(--sp-xs)" }}>Voter Readiness Checklist</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--sp-xs)" }}>
            Track your preparation for election day
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-sm)", marginTop: "var(--sp-sm)", maxWidth: 400 }}>
            <div className="progress" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-heading)" }}>{progress.percentage}%</span>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: "flex", gap: "var(--sp-sm)", flexDirection: "column" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 72, background: "var(--bg-white)", borderRadius: "var(--r-xl)", border: "1px solid var(--border-light)", animation: "fadeIn 1s ease infinite alternate" }} />
            ))}
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xs)" }}>
            {items.map((ci) => (
              <motion.div key={ci.id} variants={item}>
                <button
                  onClick={() => handleToggle(ci.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "var(--bg-white)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--r-lg)",
                    padding: "var(--sp-sm) var(--sp-md)",
                    cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: "44px 1fr auto",
                    gap: "var(--sp-md)",
                    alignItems: "center",
                    transition: "all var(--dur-fast) var(--ease-out)",
                  }}
                  aria-label={`${ci.completed ? "Uncheck" : "Check"}: ${ci.label}`}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: "var(--r-lg)",
                    background: ci.completed ? "var(--success)" : "var(--accent-light)",
                    color: ci.completed ? "white" : "var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: ci.completed ? 18 : 20,
                    transition: "all var(--dur-fast) var(--ease-out)",
                  }}>
                    {ci.completed ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : ci.icon}
                  </div>
                  <div>
                    <strong style={{
                      display: "block", fontSize: "var(--text-body-md)", fontFamily: "var(--font-heading)", fontWeight: 700,
                      color: ci.completed ? "var(--text-tertiary)" : "var(--text-heading)",
                      textDecoration: ci.completed ? "line-through" : "none",
                    }}>{ci.label}</strong>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "capitalize" }}>{ci.category}</span>
                  </div>
                  <span className={ci.completed ? "badge badge-success" : "badge"}>{ci.completed ? "Done" : "To Do"}</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
