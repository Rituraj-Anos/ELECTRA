import { getAuthToken } from "./firebase";
import type { LearningModule, QuizQuestion, TimelineEvent, GlossaryTerm } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * @description Helper function to fetch from the API with authentication
 * @param {string} path - API path
 * @param {RequestInit} opts - Fetch options
 * @returns {Promise<unknown>} The JSON response
 */
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
/**
 * @description Streams a chat response from the backend
 * @param {ChatMessage[]} messages - Array of chat messages
 * @param {string} sessionId - Unique session identifier
 * @param {string} [moduleContext] - Optional context for the module
 * @param {(token: string) => void} [onToken] - Callback for each token
 * @param {() => void} [onDone] - Callback when stream completes
 * @param {(err: string) => void} [onError] - Callback for stream errors
 * @returns {Promise<void>}
 */
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      onError?.(err.message || "Stream failed");
    } else {
      onError?.("Stream failed");
    }
  }
}

/* ── Modules ── */
/**
 * @description Fetches election modules from the backend API
 * @param {string} [country] - Optional ISO country code
 * @returns {Promise<{ modules: LearningModule[] }>} Object containing array of learning modules
 */
export function fetchModules(country?: string): Promise<{ modules: LearningModule[] }> {
  return apiFetch(`/modules${country ? `?country=${country}` : ""}`) as Promise<{ modules: LearningModule[] }>;
}

/**
 * @description Fetches a single election module by ID
 * @param {string} id - Module ID
 * @returns {Promise<{ module: LearningModule }>} Object containing the requested learning module
 */
export function fetchModule(id: string): Promise<{ module: LearningModule }> {
  return apiFetch(`/modules/${id}`) as Promise<{ module: LearningModule }>;
}

/* ── Quiz ── */
/**
 * @description Fetches the quiz for a given module
 * @param {string} moduleId - Module ID
 * @returns {Promise<{ questions: QuizQuestion[]; moduleTitle: string; questionCount: number }>} Quiz data
 */
export function fetchQuiz(moduleId: string): Promise<{ questions: QuizQuestion[]; moduleTitle: string; questionCount: number }> {
  return apiFetch(`/quiz/${moduleId}`) as Promise<{ questions: QuizQuestion[]; moduleTitle: string; questionCount: number }>;
}

/**
 * @description Submits quiz answers for a module
 * @param {string} sessionId - User session ID
 * @param {string} moduleId - Module ID
 * @param {{ questionId: string; selectedAnswer: string }[]} answers - User answers
 * @returns {Promise<unknown>} Result of the submission
 */
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
/**
 * @description Fetches the timeline for a given country
 * @param {string} country - Country name or code
 * @returns {Promise<{ events: TimelineEvent[] }>} Object containing array of timeline events
 */
export function fetchTimeline(country: string): Promise<{ events: TimelineEvent[] }> {
  return apiFetch(`/timeline?country=${encodeURIComponent(country)}`) as Promise<{ events: TimelineEvent[] }>;
}

/* ── Glossary ── */
/**
 * @description Fetches the glossary terms
 * @returns {Promise<{ terms: GlossaryTerm[] }>} Object containing array of glossary terms
 */
export function fetchGlossary(): Promise<{ terms: GlossaryTerm[] }> {
  return apiFetch("/glossary") as Promise<{ terms: GlossaryTerm[] }>;
}

/* ── Polling ── */
/**
 * @description Searches for polling locations based on an address
 * @param {string} address - Address to search
 * @returns {Promise<unknown>} Polling location data
 */
export function searchPolling(address: string) {
  return apiFetch(`/polling?address=${encodeURIComponent(address)}`);
}

/* ── Translation ── */
/**
 * @description Translates text to a target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<{translatedText: string}>} Translated text
 */
export function translateText(text: string, targetLang: string): Promise<{translatedText: string}> {
  return apiFetch("/translate", {
    method: "POST",
    body: JSON.stringify({ text, targetLanguage: targetLang }),
  }) as Promise<{translatedText: string}>;
}

/* ── TTS ── */
/**
 * @description Synthesizes speech from text
 * @param {string} text - Text to synthesize
 * @param {string} [lang] - Optional language code
 * @returns {Promise<{audioContent: string}>} Audio content in base64
 */
export function synthesizeSpeech(text: string, lang?: string): Promise<{audioContent: string}> {
  return apiFetch("/tts", {
    method: "POST",
    body: JSON.stringify({ text, languageCode: lang || "en-US" }),
  }) as Promise<{audioContent: string}>;
}

/* ── Checklist ── */
/**
 * @description Fetches the checklist for a user
 * @param {string} userId - User ID
 * @returns {Promise<{ items: ChecklistItem[]; progress: { completed: number; total: number; percentage: number } }>} Checklist data
 */
export function fetchChecklist(userId: string): Promise<{ items: { id: string; label: string; completed: boolean; category: string; icon: string }[]; progress: { completed: number; total: number; percentage: number } }> {
  return apiFetch(`/checklist/${userId}`) as Promise<{ items: { id: string; label: string; completed: boolean; category: string; icon: string }[]; progress: { completed: number; total: number; percentage: number } }>;
}

/**
 * @description Updates a checklist item
 * @param {string} userId - User ID
 * @param {string} itemId - Item ID
 * @param {boolean} [completed] - Completion status
 * @returns {Promise<unknown>}
 */
export function updateChecklist(userId: string, itemId: string, completed?: boolean) {
  return apiFetch("/checklist/update", {
    method: "POST",
    body: JSON.stringify({ userId, itemId, completed }),
  });
}

/* ── Journey ── */
/**
 * @description Fetches the user journey data
 * @param {string} userId - User ID
 * @param {string} [country] - Optional country code
 * @param {string} [level] - Optional knowledge level
 * @returns {Promise<unknown>} Journey data
 */
export function fetchJourney(userId: string, country?: string, level?: string) {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (level) params.set("level", level);
  return apiFetch(`/journey/${userId}?${params.toString()}`);
}

/* ── Scenarios ── */
/**
 * @description Fetches all available scenarios
 * @returns {Promise<{ scenarios: ScenarioResult[] }>} Object containing array of scenarios
 */
export function fetchScenarios(): Promise<{ scenarios: { id: string; title: string; description: string; category: string }[] }> {
  return apiFetch("/scenarios") as Promise<{ scenarios: { id: string; title: string; description: string; category: string }[] }>;
}

/**
 * @description Simulates a scenario
 * @param {string} scenario - Scenario description
 * @param {string} [country] - Optional country code
 * @returns {Promise<ScenarioResult>} Simulation result
 */
export function simulateScenario(scenario: string, country?: string): Promise<Record<string, string>> {
  return apiFetch("/scenario", {
    method: "POST",
    body: JSON.stringify({ scenario, country }),
  }) as Promise<Record<string, string>>;
}

/* ── Analytics ── */
/**
 * @description Fetches analytics insights for a user
 * @param {string} userId - User ID
 * @returns {Promise<unknown>} Analytics data
 */
export function fetchAnalytics(userId: string) {
  return apiFetch(`/analytics/insights/${userId}`);
}

/* ── Languages ── */
/**
 * @description Fetches available languages
 * @returns {Promise<unknown>} Array of languages
 */
export function fetchLanguages() {
  return apiFetch("/languages");
}

/* ── Auth ── */
/**
 * @description Registers a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} [displayName] - Optional display name
 * @param {string} [country] - Optional country code
 * @returns {Promise<unknown>} Auth result
 */
export function registerUser(email: string, password: string, displayName?: string, country?: string) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName, country }),
  });
}

/**
 * @description Logs in a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<unknown>} Auth result
 */
export function loginUser(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * @description Authenticates a user via Google
 * @param {string} firebaseUid - Firebase user ID
 * @param {string} [email] - Optional user email
 * @param {string} [displayName] - Optional display name
 * @param {string} [photoURL] - Optional photo URL
 * @returns {Promise<unknown>} Auth result
 */
export function googleAuth(firebaseUid: string, email?: string, displayName?: string, photoURL?: string) {
  return apiFetch("/auth/google", {
    method: "POST",
    body: JSON.stringify({ firebaseUid, email, displayName, photoURL }),
  });
}

/**
 * @description Retrieves current user information
 * @param {string} jwtToken - JWT auth token
 * @returns {Promise<unknown>} User data
 */
export function getMe(jwtToken: string) {
  return apiFetch("/auth/me", {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
}

/**
 * @description Completes the user profile
 * @param {string} jwtToken - JWT auth token
 * @param {{ displayName?: string; country?: string; state?: string; knowledgeLevel?: string; language?: string }} data - Profile data
 * @returns {Promise<unknown>} Result of profile completion
 */
export function completeProfile(jwtToken: string, data: { displayName?: string; country?: string; state?: string; knowledgeLevel?: string; language?: string }) {
  return apiFetch("/auth/complete-profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${jwtToken}` },
    body: JSON.stringify(data),
  });
}
