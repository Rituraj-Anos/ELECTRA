"use client";

import { useState, useEffect } from "react";
import { fetchScenarios, simulateScenario } from "@/lib/api";
import { motion } from "motion/react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [customScenario, setCustomScenario] = useState("");

  useEffect(() => {
    fetchScenarios()
      .then((data) => setScenarios(data.scenarios || []))
      .catch(() => setScenarios([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleSimulate(scenarioText: string) {
    setSelectedScenario(scenarioText);
    setSimulating(true);
    setAnalysis(null);
    try {
      const res = await simulateScenario(scenarioText);
      setAnalysis(res.analysis || "No analysis available.");
    } catch {
      setAnalysis("Simulation failed. Please try again.");
    } finally {
      setSimulating(false);
    }
  }

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container" style={{ maxWidth: 760, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: "var(--sp-xl)" }}>
          <span className="section-tag">Simulate</span>
          <h1 style={{ fontFamily: "var(--font-heading)", marginTop: "var(--sp-xs)" }}>Election Scenario Simulator</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--sp-xs)" }}>
            Explore &ldquo;what if&rdquo; scenarios to understand how elections work in different situations
          </p>
        </motion.div>

        {/* Custom scenario input */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: "flex", gap: "var(--sp-xs)", marginBottom: "var(--sp-lg)" }}>
          <input
            className="input"
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && customScenario.trim() && handleSimulate(customScenario)}
            placeholder="Type your own scenario... e.g. &quot;What if voting was mandatory?&quot;"
            aria-label="Custom election scenario"
          />
          <button
            className="btn btn-primary"
            onClick={() => customScenario.trim() && handleSimulate(customScenario)}
            disabled={simulating || !customScenario.trim()}
            style={{ whiteSpace: "nowrap" }}
          >
            {simulating ? "Simulating..." : "Simulate"}
          </button>
        </motion.div>

        {/* Preset scenarios */}
        {loading ? (
          <div style={{ display: "flex", gap: "var(--sp-sm)", flexDirection: "column" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 80, background: "var(--bg-white)", borderRadius: "var(--r-xl)", border: "1px solid var(--border-light)", animation: "fadeIn 1s ease infinite alternate" }} />
            ))}
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xs)" }}>
            {scenarios.map((s) => (
              <motion.div key={s.id} variants={item}>
                <button
                  onClick={() => handleSimulate(s.title)}
                  disabled={simulating}
                  style={{
                    width: "100%", textAlign: "left", background: selectedScenario === s.title ? "var(--accent-light)" : "var(--bg-white)",
                    border: selectedScenario === s.title ? "1px solid var(--accent)" : "1px solid var(--border-light)",
                    borderRadius: "var(--r-lg)", padding: "var(--sp-sm) var(--sp-md)", cursor: "pointer",
                    display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--sp-md)", alignItems: "center",
                    transition: "all var(--dur-fast) var(--ease-out)",
                  }}
                >
                  <div>
                    <strong style={{ display: "block", fontSize: "var(--text-body-md)", color: "var(--text-heading)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>{s.title}</strong>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{s.description}</span>
                  </div>
                  <span className="badge" style={{ textTransform: "capitalize" }}>{s.category}</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Analysis result */}
        {(simulating || analysis) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "var(--sp-xl)" }}>
            <div style={{
              background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: "var(--r-xl)",
              padding: "var(--sp-lg)", boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-xs)", marginBottom: "var(--sp-sm)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--r-md)", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  🔮
                </div>
                <strong style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-heading)" }}>Simulation Result</strong>
              </div>
              {simulating ? (
                <p style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>Analyzing scenario...</p>
              ) : (
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{analysis}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
