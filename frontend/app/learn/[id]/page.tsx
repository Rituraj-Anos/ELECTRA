"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/store";
import { fetchModule } from "@/lib/api";
import type { LearningModule } from "@/lib/types";
import { motion } from "motion/react";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { completeModule, completedModules } = useSessionStore();
  const [mod, setMod] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const moduleId = params?.id as string;

  useEffect(() => {
    if (!moduleId) return;
    fetchModule(moduleId)
      .then((data) => setMod(data.module))
      .catch(() => setMod(null))
      .finally(() => setLoading(false));
  }, [moduleId]);

  if (loading) return <div className="container" style={{ paddingTop: "var(--sp-xl)", color: "var(--text-secondary)" }}>Loading module...</div>;
  if (!mod) return <div className="container" style={{ paddingTop: "var(--sp-xl)" }}>Module not found.</div>;

  const isDone = completedModules.includes(mod.id);

  function handleComplete() {
    completeModule(mod!.id);
    router.push(`/quiz/${mod!.id}`);
  }

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <article className="container" style={{ maxWidth: 760, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "var(--sp-md)", fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>
          <button onClick={() => router.push("/learn")} style={{ cursor: "pointer", background: "none", border: "none", color: "var(--accent)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
            ← Learning Modules
          </button>
        </nav>

        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }} style={{ marginBottom: "var(--sp-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-sm)", marginBottom: "var(--sp-xs)" }}>
            <span className="badge">{mod.estimatedMinutes} min read</span>
            {isDone && <span className="badge badge-success">Completed</span>}
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h1)" }}>{mod.title}</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "var(--sp-xs)", fontSize: "var(--text-body-lg)" }}>{mod.description}</p>
        </motion.header>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-md)" }}>
          {mod.content.map((section, i) => (
            <ContentSection key={i} section={section} />
          ))}
        </motion.div>

        {/* Quiz CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginTop: "var(--sp-xl)", padding: "var(--sp-lg)", background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: "var(--r-2xl)", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "var(--sp-xs)" }}>Ready to test your knowledge?</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--sp-md)" }}>
            Take a {mod.quizQuestions?.length || 5}-question quiz to reinforce what you learned.
          </p>
          <button className="btn btn-primary" onClick={handleComplete}>
            {isDone ? "Retake Quiz" : "Take the Quiz"}
          </button>
        </motion.div>
      </article>
    </div>
  );
}

function ContentSection({ section }: { section: any }) {
  switch (section.type) {
    case "heading":
      return <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h2)", marginTop: "var(--sp-sm)", color: "var(--text-heading)" }}>{section.text}</h2>;
    case "body":
      return <p style={{ color: "var(--text-body)", lineHeight: 1.7, fontSize: "var(--text-body-md)" }}>{section.text}</p>;
    case "callout":
      return (
        <div style={{ padding: "var(--sp-md)", background: "var(--accent-light)", borderRadius: "var(--r-lg)", fontSize: "var(--text-sm)", color: "var(--text-heading)", borderLeft: "3px solid var(--accent)" }}>
          {section.text}
        </div>
      );
    case "note":
      return (
        <div style={{ padding: "var(--sp-md)", background: "var(--bg-white)", borderRadius: "var(--r-lg)", border: "1px solid var(--border-light)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          {section.text}
        </div>
      );
    case "steps":
      return (
        <ol style={{ paddingLeft: "var(--sp-md)", display: "flex", flexDirection: "column", gap: "var(--sp-xs)", color: "var(--text-body)" }}>
          {section.items?.map((item: string, i: number) => (
            <li key={i} style={{ fontSize: "var(--text-sm)", lineHeight: 1.7 }}>{item}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}
