"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchQuiz, submitQuiz } from "@/lib/api";
import { useSessionStore } from "@/lib/store";
import type { QuizQuestion, QuizResult } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

/* ── Helpers ────────────────────────────────────────────────────── */

/** Fetch full quiz data (with correct answers) from backend for local scoring */
async function fetchQuizFull(moduleId: string): Promise<QuizQuestion[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const res = await fetch(`${base}/quiz/${moduleId}/full`);
    if (res.ok) {
      const data = await res.json();
      return data.questions || [];
    }
  } catch { /* fallback below */ }
  return [];
}

function getPerformanceLabel(score: number): string {
  if (score === 100) return "Election Expert!";
  if (score >= 60) return "Well Done!";
  return "Keep Studying!";
}

/** Score quiz locally using the original questions data (which includes correct answers from module JSON) */
function scoreLocally(
  questions: QuizQuestion[],
  answers: Record<string, string>,
  fullQuestions: QuizQuestion[],
): QuizResult {
  // Use fullQuestions if available (has correctAnswer), otherwise try questions
  const source = fullQuestions.length > 0 ? fullQuestions : questions;
  const feedback: QuizResult["feedback"] = [];
  let correctCount = 0;

  for (const q of source) {
    const selected = answers[q.id] || "";
    const correct = (q as any).correctAnswer || "";
    const isCorrect = selected === correct;
    if (isCorrect) correctCount++;

    feedback.push({
      questionId: q.id,
      question: q.question,
      selectedAnswer: selected,
      correctAnswer: correct,
      isCorrect,
      explanation: (q as any).explanation || "",
    });
  }

  const totalQuestions = source.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    score,
    correctCount,
    totalQuestions,
    performanceLabel: getPerformanceLabel(score),
    feedback,
  };
}

/* ── Page Component ──────────────────────────────────────────── */

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { sessionId } = useSessionStore();
  const moduleId = params?.moduleId as string;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [fullQuestions, setFullQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!moduleId) return;

    // Fetch display questions (no answers) AND full questions (with answers) in parallel
    Promise.all([
      fetchQuiz(moduleId).then((d) => d.questions || []).catch(() => []),
      fetchQuizFull(moduleId).catch(() => []),
    ]).then(([displayQ, fullQ]) => {
      setQuestions(displayQ);
      setFullQuestions(fullQ as QuizQuestion[]);
      setLoading(false);
    });
  }, [moduleId]);

  async function handleSubmit() {
    setSubmitting(true);

    // 1. ALWAYS score locally first so user never sees "Error"
    const localResult = scoreLocally(questions, answers, fullQuestions);

    // 2. Try backend in parallel (fire-and-forget for persistence)
    try {
      const answerPayload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));
      const serverResult = await submitQuiz(sessionId || "", moduleId, answerPayload);

      // If backend succeeded, use its result (more authoritative)
      if (serverResult && typeof serverResult.score === "number") {
        setResult(serverResult);
      } else {
        setResult(localResult);
      }
    } catch {
      // Backend down? No problem — use local score
      setResult(localResult);
    }

    setSubmitting(false);
  }

  if (loading)
    return (
      <div className="container" style={{ paddingTop: "var(--sp-xl)", color: "var(--text-secondary)" }}>
        Loading quiz...
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="container" style={{ paddingTop: "var(--sp-xl)" }}>
        No quiz available for this module.
      </div>
    );

  /* ── Results Screen ── */
  if (result) {
    const scoreColor =
      result.score >= 80 ? "var(--success)" : result.score >= 60 ? "var(--accent)" : "var(--error)";
    const circumference = 2 * Math.PI * 70;

    return (
      <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="container"
          style={{ maxWidth: 640, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)", textAlign: "center" }}
        >
          {/* Score circle */}
          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto var(--sp-lg)" }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border-light)" strokeWidth="8" />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - result.score / 100) }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.3 }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-h1)",
                  fontWeight: 800,
                  color: "var(--text-heading)",
                }}
              >
                {result.score}%
              </motion.span>
            </div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ fontFamily: "var(--font-heading)", color: scoreColor }}
          >
            {result.performanceLabel}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ color: "var(--text-secondary)", margin: "var(--sp-xs) 0 var(--sp-lg)" }}
          >
            {result.correctCount} of {result.totalQuestions} correct
          </motion.p>

          {/* Feedback per question */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: "var(--sp-sm)", textAlign: "left" }}
          >
            {result.feedback.map((f, i) => (
              <motion.div
                key={f.questionId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                style={{
                  padding: "var(--sp-md)",
                  borderRadius: "var(--r-lg)",
                  background: f.isCorrect ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                  border: `1px solid ${f.isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-xs)" }}>
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
                    {f.isCorrect ? "✅" : "❌"}
                  </span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-heading)" }}>
                      {f.question}
                    </p>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginTop: 4 }}>
                      Your answer: <strong>{f.selectedAnswer}</strong>
                      {!f.isCorrect && (
                        <>
                          {" "}| Correct: <strong style={{ color: "var(--success)" }}>{f.correctAnswer}</strong>
                        </>
                      )}
                    </p>
                    {!f.isCorrect && f.explanation && (
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--text-tertiary)",
                          marginTop: 4,
                          fontStyle: "italic",
                        }}
                      >
                        {f.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "var(--sp-sm)", justifyContent: "center", marginTop: "var(--sp-lg)" }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setResult(null);
                setAnswers({});
                setCurrentQ(0);
              }}
            >
              Retake Quiz
            </button>
            <button className="btn btn-primary" onClick={() => router.push("/learn")}>
              Next Module →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Question Screen ── */
  const q = questions[currentQ];

  return (
    <div style={{ background: "var(--bg-cream)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container" style={{ maxWidth: 640, paddingTop: "var(--sp-xl)", paddingBottom: "var(--sp-3xl)" }}>
        {/* Progress */}
        <div style={{ marginBottom: "var(--sp-lg)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              marginBottom: "var(--sp-xs)",
            }}
          >
            <span>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="progress">
            <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-h3)",
                marginBottom: "var(--sp-md)",
                color: "var(--text-heading)",
              }}
            >
              {q.question}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xs)" }}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                  style={{
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "var(--sp-sm) var(--sp-md)",
                    borderRadius: "var(--r-lg)",
                    background: answers[q.id] === opt ? "var(--accent-light)" : "var(--bg-white)",
                    border: answers[q.id] === opt ? "1.5px solid var(--accent)" : "1px solid var(--border-light)",
                    color: answers[q.id] === opt ? "var(--accent)" : "var(--text-heading)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    fontWeight: answers[q.id] === opt ? 600 : 400,
                    transition: "all var(--dur-fast) var(--ease-out)",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--sp-lg)" }}>
          <button
            className="btn btn-ghost"
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(currentQ - 1)}
            style={{ opacity: currentQ === 0 ? 0.3 : 1 }}
          >
            Previous
          </button>
          {currentQ < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setCurrentQ(currentQ + 1)}>
              Next
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={Object.keys(answers).length < questions.length || submitting}
              onClick={handleSubmit}
              style={{ opacity: Object.keys(answers).length < questions.length ? 0.4 : 1 }}
            >
              {submitting ? "Scoring..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
