/* ═══════════════════════════════════════════════════════════════════
   ELECTRA — API Client
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers as Record<string, string>) },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ── Chat (SSE streaming) ─────────────────────────────────────────── */
export async function streamChat(
  messages: { role: string; content: string }[],
  sessionId: string,
  moduleContext?: string,
  onToken?: (token: string) => void,
  onDone?: () => void,
  onError?: (err: string) => void,
) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, sessionId, moduleContext }),
    });

    if (!res.ok || !res.body) {
      onError?.(`Request failed: ${res.status}`);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            onDone?.();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) onToken?.(parsed.token);
          } catch {
            onToken?.(data);
          }
        }
      }
    }
    onDone?.();
  } catch (err: any) {
    onError?.(err.message || "Stream failed");
  }
}

/* ── Modules ──────────────────────────────────────────────────────── */
export function fetchModules(country?: string) {
  const q = country ? `?country=${country}` : "";
  return apiFetch(`/modules${q}`);
}

export function fetchModule(id: string) {
  return apiFetch(`/modules/${id}`);
}

/* ── Quiz ─────────────────────────────────────────────────────────── */
export function fetchQuiz(moduleId: string) {
  return apiFetch(`/quiz/${moduleId}`);
}

export function submitQuiz(sessionId: string, moduleId: string, answers: { questionId: string; selectedAnswer: string }[]) {
  return apiFetch(`/quiz/${moduleId}/submit`, {
    method: "POST",
    body: JSON.stringify({ sessionId, answers }),
  });
}

/* ── Timeline ─────────────────────────────────────────────────────── */
export function fetchTimeline(country: string) {
  return apiFetch(`/timeline?country=${encodeURIComponent(country)}`);
}

/* ── Glossary ─────────────────────────────────────────────────────── */
export function fetchGlossary() {
  return apiFetch("/glossary");
}

/* ── Polling ──────────────────────────────────────────────────────── */
export function searchPolling(address: string) {
  return apiFetch(`/polling?address=${encodeURIComponent(address)}`);
}

/* ── Translation ──────────────────────────────────────────────────── */
export function translateText(text: string, targetLang: string) {
  return apiFetch("/translate", {
    method: "POST",
    body: JSON.stringify({ text, targetLanguage: targetLang }),
  });
}

/* ── TTS ──────────────────────────────────────────────────────────── */
export function synthesizeSpeech(text: string, lang?: string) {
  return apiFetch("/tts", {
    method: "POST",
    body: JSON.stringify({ text, languageCode: lang || "en-US" }),
  });
}
