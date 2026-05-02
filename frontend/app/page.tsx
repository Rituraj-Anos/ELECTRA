"use client";

import Link from "next/link";
import { useSessionStore } from "@/lib/store";
import { COUNTRIES } from "@/lib/types";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

/* ── Animated counter hook ──────────────────────────────────── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return { count, ref };
}

/* ── Motion variants ────────────────────────────────────────── */
const EASE = [0.25, 0.1, 0.25, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function DashboardPage() {
  const { country, knowledgeLevel, completedModules, goal } = useSessionStore();
  const countryData = COUNTRIES.find((c) => c.code === country);
  const progress = Math.round((completedModules.length / 8) * 100);

  return (
    <div>
      {/* ════ HERO SECTION ════ */}
      <section style={{ background: "var(--bg-cream)", padding: "var(--sp-4xl) 0 var(--sp-3xl)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-xl)", alignItems: "center" }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="section-tag">Election Education</span>
            <h1 style={{ fontSize: "var(--text-hero)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", marginTop: "var(--sp-sm)" }}>
              Your AI guide to{" "}
              <span style={{ color: "var(--accent)" }}>democratic</span>{" "}
              participation
            </h1>
            <p style={{ fontSize: "var(--text-body-lg)", color: "var(--text-secondary)", marginTop: "var(--sp-md)", maxWidth: "48ch", lineHeight: 1.7 }}>
              {goal === "register"
                ? "Get ready to vote with personalized guidance for your region."
                : goal === "teach"
                ? "Preparing you to help others participate in democracy."
                : "Understand elections, voter registration, and civic processes with AI-powered education."}
            </p>
            <div style={{ display: "flex", gap: "var(--sp-sm)", marginTop: "var(--sp-lg)" }}>
              <Link href="/learn" className="btn btn-primary">Continue Learning</Link>
              <Link href="/chat" className="btn btn-secondary">Ask ELECTRA</Link>
            </div>
          </motion.div>

          {/* Right: progress mosaic */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }} style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "relative", width: 280, height: 280 }}>
              {/* Main progress circle */}
              <div style={{ width: 200, height: 200, position: "absolute", top: 20, left: 40, background: "white", borderRadius: 24, border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: "var(--shadow-lg)" }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-light)" strokeWidth="6" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`} style={{ transition: "stroke-dashoffset 1s var(--ease-out)" }} />
                </svg>
                <span style={{ position: "absolute", fontFamily: "var(--font-heading)", fontSize: "var(--text-h2)", fontWeight: 800, color: "var(--accent)" }}>{progress}%</span>
              </div>
              {/* Floating badge */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: 0, right: 0, background: "var(--accent)", color: "white", padding: "10px 16px", borderRadius: "var(--r-lg)", fontSize: "var(--text-sm)", fontWeight: 700, boxShadow: "0 8px 24px rgba(232,56,13,0.3)" }}>
                {completedModules.length}/8 Modules
              </motion.div>
              {/* Country badge */}
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", bottom: 10, left: 0, background: "white", padding: "10px 16px", borderRadius: "var(--r-lg)", fontSize: "var(--text-sm)", fontWeight: 600, border: "1px solid var(--border-light)", boxShadow: "var(--shadow-md)", color: "var(--text-heading)" }}>
                {countryData ? `${countryData.flag} ${countryData.name}` : "🌍 Global"}
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* Responsive hero */}
        <style jsx global>{`
          @media (max-width: 768px) {
            .container { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ════ FEATURES / QUICK ACTIONS ════ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} style={{ background: "var(--bg-white)", padding: "var(--sp-4xl) 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--sp-xl)" }}>
            <motion.span variants={item} className="section-tag">Our Features</motion.span>
            <motion.h2 variants={item} style={{ marginTop: "var(--sp-sm)" }}>Expert Tools to Empower Voters</motion.h2>
          </div>
          <motion.div variants={stagger} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-md)" }}>
            {[
              { href: "/learn", title: "Learning Modules", desc: `${completedModules.length}/8 completed — structured courses on election processes`, color: "var(--accent)" },
              { href: "/timeline", title: "Election Timeline", desc: countryData ? `Key dates for ${countryData.flag} ${countryData.name}` : "View critical election milestones", color: "var(--info)" },
              { href: "/chat", title: "AI Assistant", desc: "Ask ELECTRA anything about voting, elections, and civic rights", color: "var(--accent)" },
              { href: "/polling", title: "Polling Locator", desc: "Find your nearest voting station with address search", color: "var(--success)" },
              { href: "/glossary", title: "Civic Glossary", desc: "40+ election terms explained in plain language", color: "var(--accent)" },
              { href: "/quiz/intro-to-voting", title: "Knowledge Quizzes", desc: "Test your understanding after each learning module", color: "var(--info)" },
            ].map((f, i) => (
              <motion.div key={f.href + f.title} variants={item}>
                <Link href={f.href} className="card card-interactive" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "var(--sp-sm)", padding: "var(--sp-lg)", minHeight: 180 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--r-md)", background: f.color === "var(--accent)" ? "var(--accent-light)" : f.color === "var(--info)" ? "rgba(59,130,246,0.1)" : "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: f.color }} />
                  </div>
                  <strong style={{ fontSize: "var(--text-body-lg)", color: "var(--text-heading)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>{f.title}</strong>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--accent)", fontWeight: 600, marginTop: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                    Explore →
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ════ STATS STRIP (dark navy) ════ */}
      <section style={{ background: "var(--bg-navy)", padding: "var(--sp-3xl) 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--sp-lg)", textAlign: "center" }}>
          {[
            { end: 190, suffix: "+", label: "Countries Covered" },
            { end: 40, suffix: "+", label: "Civic Terms Defined" },
            { end: 8, suffix: "", label: "Learning Modules" },
            { end: 24, suffix: "/7", label: "AI Availability" },
          ].map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ════ USE CASES MARQUEE ════ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} style={{ background: "var(--bg-cream)", padding: "var(--sp-4xl) 0", overflow: "hidden" }}>
        <div className="container" style={{ textAlign: "center", marginBottom: "var(--sp-xl)" }}>
          <span className="section-tag">Who It Helps</span>
          <h2 style={{ marginTop: "var(--sp-sm)" }}>Civic Education for Everyone</h2>
        </div>
        <MarqueeRow items={["First-Time Voters", "Students", "Immigrants", "Educators", "Senior Citizens", "Community Leaders", "Journalists", "Poll Workers"]} direction="left" />
        <div style={{ height: "var(--sp-sm)" }} />
        <MarqueeRow items={["Rural Communities", "Urban Voters", "Overseas Citizens", "Disabled Voters", "Non-Profits", "Local Government", "Youth Groups", "Libraries"]} direction="right" />
      </motion.section>

      {/* ════ SESSION CONTEXT ════ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} style={{ background: "var(--bg-white)", padding: "var(--sp-3xl) 0" }}>
        <div className="container">
          <span className="section-tag">Your Profile</span>
          <h2 style={{ marginTop: "var(--sp-sm)", marginBottom: "var(--sp-md)" }}>Current Session</h2>
          <div style={{ display: "flex", gap: "var(--sp-sm)", flexWrap: "wrap" }}>
            <InfoChip label="Region" value={countryData ? `${countryData.flag} ${countryData.name}` : "Global"} />
            <InfoChip label="Level" value={knowledgeLevel} />
            <InfoChip label="Goal" value={goal === "register" ? "Register to Vote" : goal === "teach" ? "Teach Others" : "Understand Elections"} />
            <InfoChip label="Progress" value={`${completedModules.length} / 8 modules`} />
          </div>
        </div>
      </motion.section>

      {/* ════ CTA BANNER (Flexio dark navy + shapes) ════ */}
      <section style={{ background: "var(--bg-navy)", padding: "var(--sp-4xl) 0", position: "relative", overflow: "hidden" }}>
        {/* Decorative shapes */}
        <div style={{ position: "absolute", top: 40, left: "10%", width: 80, height: 80, borderRadius: "50%", background: "rgba(232,56,13,0.15)" }} />
        <div style={{ position: "absolute", bottom: 30, right: "8%", width: 120, height: 60, borderRadius: "var(--r-xl)", background: "rgba(59,130,246,0.1)" }} />
        <div style={{ position: "absolute", top: "50%", right: "20%", width: 40, height: 40, borderRadius: "50%", background: "rgba(253,248,243,0.08)" }} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <span className="section-tag" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>Ready to Start?</span>
          <h2 style={{ color: "var(--text-on-dark)", marginTop: "var(--sp-sm)", fontSize: "var(--text-h1)" }}>
            Become an Informed Voter Today
          </h2>
          <p style={{ color: "var(--text-on-dark-secondary)", maxWidth: "52ch", margin: "var(--sp-md) auto 0", fontSize: "var(--text-body-lg)" }}>
            Start your civic education journey with AI-powered guidance tailored to your region and experience level.
          </p>
          <div style={{ display: "flex", gap: "var(--sp-sm)", justifyContent: "center", marginTop: "var(--sp-lg)" }}>
            <Link href="/learn" className="btn btn-primary-dark">Start Learning</Link>
            <Link href="/chat" className="btn btn-secondary-dark">Ask ELECTRA</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */
function StatItem({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(end);
  return (
    <div ref={ref} style={{ padding: "var(--sp-md)" }}>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h1)", fontWeight: 800, color: "var(--accent)" }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--text-on-dark-secondary)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: "var(--sp-sm)", whiteSpace: "nowrap", width: "fit-content" }}
      >
        {doubled.map((t, i) => (
          <span key={`${t}-${i}`} style={{ display: "inline-flex", padding: "10px 24px", borderRadius: "var(--r-pill)", border: "1.5px solid var(--border-light)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-body)", background: "var(--bg-white)" }}>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-xs)", background: "var(--bg-cream)", border: "1px solid var(--border-light)", borderRadius: "var(--r-pill)", padding: "8px var(--sp-sm)", fontSize: "var(--text-sm)" }}>
      <span style={{ color: "var(--text-tertiary)" }}>{label}:</span>
      <span style={{ fontWeight: 600, textTransform: "capitalize", color: "var(--text-heading)" }}>{value}</span>
    </div>
  );
}
