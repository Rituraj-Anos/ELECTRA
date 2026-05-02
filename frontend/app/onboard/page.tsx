"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/store";
import { COUNTRIES, type KnowledgeLevel, type LearningGoal } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

const LEVELS: { id: KnowledgeLevel; label: string; desc: string }[] = [
  { id: "beginner", label: "New Voter", desc: "First time voting or new to the process" },
  { id: "intermediate", label: "Informed Citizen", desc: "Know the basics, want deeper understanding" },
  { id: "expert", label: "Civic Leader", desc: "Well-versed, looking for advanced topics" },
];

const GOALS: { id: LearningGoal; label: string; desc: string }[] = [
  { id: "register", label: "Register to Vote", desc: "Get ready for an upcoming election" },
  { id: "understand", label: "Understand Elections", desc: "Learn how democracy works" },
  { id: "teach", label: "Teach Others", desc: "Help family and community participate" },
];

export default function OnboardPage() {
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState<KnowledgeLevel>("beginner");
  const [goal, setGoal] = useState<LearningGoal>("understand");

  function handleFinish() {
    const sessionId = crypto.randomUUID?.() || Date.now().toString(36);
    setSession({ sessionId, country, knowledgeLevel: level, goal, isOnboarded: true });
    router.push("/");
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "var(--sp-xl)", background: "var(--bg-cream)",
    }}>
      {/* Brand hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} style={{ textAlign: "center", marginBottom: "var(--sp-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "var(--sp-sm)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "var(--r-lg)", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26 }}>E</div>
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-hero)", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em" }}>ELECTRA</h1>
        <p style={{ fontSize: "var(--text-body-lg)", color: "var(--text-secondary)", marginTop: "var(--sp-xs)" }}>
          Your AI-powered guide to understanding elections
        </p>
      </motion.div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "var(--sp-xs)", marginBottom: "var(--sp-lg)" }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} animate={{ width: step >= i ? 32 : 8 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} style={{ height: 8, borderRadius: "var(--r-pill)", background: step >= i ? "var(--accent)" : "var(--border-light)" }} />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }} style={{ width: "100%", maxWidth: 560, background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: "var(--r-2xl)", padding: "var(--sp-xl)", boxShadow: "var(--shadow-lg)" }}>
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "var(--sp-xs)" }}>Select your country</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--sp-md)" }}>Content is tailored to your region&apos;s election process</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "var(--sp-xs)" }}>
                {COUNTRIES.map((c) => (
                  <button key={c.code} onClick={() => setCountry(c.code)} className={`card ${country === c.code ? "card-selected" : "card-interactive"}`} style={{ cursor: "pointer", textAlign: "center", padding: "var(--sp-sm)", border: country === c.code ? "1.5px solid var(--accent)" : "1px solid var(--border-light)", background: country === c.code ? "var(--accent-light)" : "var(--bg-white)" }}>
                    <span style={{ fontSize: "1.5rem", display: "block" }}>{c.flag}</span>
                    <span style={{ fontSize: "var(--text-sm)", marginTop: 4, display: "block", color: "var(--text-heading)" }}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "var(--sp-xs)" }}>Your experience level</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--sp-md)" }}>We adapt complexity to match your knowledge</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xs)" }}>
                {LEVELS.map((l) => (
                  <button key={l.id} onClick={() => setLevel(l.id)} className={`card ${level === l.id ? "card-selected" : "card-interactive"}`} style={{ cursor: "pointer", textAlign: "left", padding: "var(--sp-sm) var(--sp-md)", border: level === l.id ? "1.5px solid var(--accent)" : "1px solid var(--border-light)", background: level === l.id ? "var(--accent-light)" : "var(--bg-white)" }}>
                    <strong style={{ display: "block", color: "var(--text-heading)" }}>{l.label}</strong>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "var(--sp-xs)" }}>What brings you here?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--sp-md)" }}>Your goal shapes the learning path</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xs)" }}>
                {GOALS.map((g) => (
                  <button key={g.id} onClick={() => setGoal(g.id)} className={`card ${goal === g.id ? "card-selected" : "card-interactive"}`} style={{ cursor: "pointer", textAlign: "left", padding: "var(--sp-sm) var(--sp-md)", border: goal === g.id ? "1.5px solid var(--accent)" : "1px solid var(--border-light)", background: goal === g.id ? "var(--accent-light)" : "var(--bg-white)" }}>
                    <strong style={{ display: "block", color: "var(--text-heading)" }}>{g.label}</strong>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--sp-lg)" }}>
            {step > 0 ? (
              <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>
            ) : <div />}
            {step < 2 ? (
              <button className="btn btn-primary" disabled={step === 0 && !country} onClick={() => setStep(step + 1)} style={{ opacity: step === 0 && !country ? 0.4 : 1 }}>Continue</button>
            ) : (
              <button className="btn btn-primary" onClick={handleFinish}>Start Learning</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
