import { getAuthToken } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers as Record<string, string>),
    },
    ...opts,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

/* ── Chat (SSE streaming) ── */
export async function streamChat(
  messages: { role: string; content: string }[],
  sessionId: string,
  moduleContext?: string,
  onToken?: (token: string) => void,
  onDone?: () => void,
  onError?: (err: string) => void,
) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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

/* ── Modules ── */
export function fetchModules(country?: string) {
  return apiFetch(`/modules${country ? `?country=${country}` : ""}`);
}
export function fetchModule(id: string) {
  return apiFetch(`/modules/${id}`);
}

/* ── Quiz ── */
export function fetchQuiz(moduleId: string) {
  return apiFetch(`/quiz/${moduleId}`);
}
export function submitQuiz(
  sessionId: string,
  moduleId: string,
  answers: { questionId: string; selectedAnswer: string }[],
) {
  return apiFetch(`/quiz/${moduleId}/submit`, {
    method: "POST",
    body: JSON.stringify({ sessionId, answers }),
  });
}

/* ── Timeline ── */
export function fetchTimeline(country: string) {
  return apiFetch(`/timeline?country=${encodeURIComponent(country)}`);
}

/* ── Glossary ── */
export function fetchGlossary() {
  return apiFetch("/glossary");
}

/* ── Polling ── */
export function searchPolling(address: string) {
  return apiFetch(`/polling?address=${encodeURIComponent(address)}`);
}

/* ── Translation ── */
export function translateText(text: string, targetLang: string) {
  return apiFetch("/translate", {
    method: "POST",
    body: JSON.stringify({ text, targetLanguage: targetLang }),
  });
}

/* ── TTS ── */
export function synthesizeSpeech(text: string, lang?: string) {
  return apiFetch("/tts", {
    method: "POST",
    body: JSON.stringify({ text, languageCode: lang || "en-US" }),
  });
}

/* ── Checklist ── */
export function fetchChecklist(userId: string) {
  return apiFetch(`/checklist/${userId}`);
}
export function updateChecklist(userId: string, itemId: string, completed?: boolean) {
  return apiFetch("/checklist/update", {
    method: "POST",
    body: JSON.stringify({ userId, itemId, completed }),
  });
}

/* ── Journey ── */
export function fetchJourney(userId: string, country?: string, level?: string) {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (level) params.set("level", level);
  return apiFetch(`/journey/${userId}?${params.toString()}`);
}

/* ── Scenarios ── */
export function fetchScenarios() {
  return apiFetch("/scenarios");
}
export function simulateScenario(scenario: string, country?: string) {
  return apiFetch("/scenario", {
    method: "POST",
    body: JSON.stringify({ scenario, country }),
  });
}

/* ── Analytics ── */
export function fetchAnalytics(userId: string) {
  return apiFetch(`/analytics/insights/${userId}`);
}

/* ── Languages ── */
export function fetchLanguages() {
  return apiFetch("/languages");
}

/* ── Auth ── */
export function registerUser(email: string, password: string, displayName?: string, country?: string) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName, country }),
  });
}

export function loginUser(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function googleAuth(firebaseUid: string, email?: string, displayName?: string, photoURL?: string) {
  return apiFetch("/auth/google", {
    method: "POST",
    body: JSON.stringify({ firebaseUid, email, displayName, photoURL }),
  });
}

export function getMe(jwtToken: string) {
  return apiFetch("/auth/me", {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
}

export function completeProfile(jwtToken: string, data: { displayName?: string; country?: string; state?: string; knowledgeLevel?: string; language?: string }) {
  return apiFetch("/auth/complete-profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${jwtToken}` },
    body: JSON.stringify(data),
  });
}
