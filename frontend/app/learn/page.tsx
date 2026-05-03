"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSessionStore } from "@/lib/store";
import { fetchModules } from "@/lib/api";
import type { LearningModule } from "@/lib/types";
import { motion } from "motion/react";

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

/**
 * @description Page component displaying all available learning modules
 * @returns {JSX.Element} Learn page component
 */
export default function LearnPage() {
  const { country, completedModules } = useSessionStore();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules(country)
      .then((data) => setModules(data.modules || []))
      .catch(() => setModules([]))
      .finally(() => setLoading(false));
  }, [country]);

  const progress = modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0;

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container" style={{ paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: "var(--sp-xl)" }}>
          <span className="section-tag">Curriculum</span>
          <h1 style={{ fontFamily: "var(--font-heading)", marginTop: "var(--sp-xs)" }}>Learning Modules</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--sp-xs)" }}>
            {completedModules.length} of {modules.length || 8} modules completed
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-sm)", marginTop: "var(--sp-sm)", maxWidth: 400 }}>
            <div className="progress" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-heading)" }}>{progress}%</span>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: "flex", gap: "var(--sp-sm)", flexDirection: "column" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 88, background: "var(--bg-white)", borderRadius: "var(--r-xl)", border: "1px solid var(--border-light)", animation: "fadeIn 1s ease infinite alternate" }} />
            ))}
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-sm)" }}>
            {modules.map((mod) => {
              const isDone = completedModules.includes(mod.id);
              return (
                <motion.div key={mod.id} variants={item}>
                  <Link href={`/learn/${mod.id}`} className="card card-interactive" style={{ textDecoration: "none", display: "grid", gridTemplateColumns: "48px 1fr auto", gap: "var(--sp-md)", alignItems: "center", padding: "var(--sp-md) var(--sp-lg)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "var(--r-lg)", background: isDone ? "var(--success)" : "var(--accent-light)", color: isDone ? "white" : "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-body-md)", fontFamily: "var(--font-mono)" }}>
                      {isDone ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : mod.order}
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "var(--text-body-md)", color: "var(--text-heading)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>{mod.title}</strong>
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{mod.description}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-xs)" }}>
                      <span className={isDone ? "badge badge-success" : "badge"}>{isDone ? "Completed" : `${mod.estimatedMinutes} min`}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
