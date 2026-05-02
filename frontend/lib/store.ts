/* ═══════════════════════════════════════════════════════════════════
   ELECTRA — Zustand Stores (persisted)
   ═══════════════════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { KnowledgeLevel, LearningGoal, Message } from "./types";

/* ── Session Store ────────────────────────────────────────────────── */
interface SessionStore {
  sessionId: string | null;
  country: string;
  knowledgeLevel: KnowledgeLevel;
  goal: LearningGoal;
  isOnboarded: boolean;
  currentModule: string | null;
  completedModules: string[];
  language: string;
  setSession: (s: Partial<SessionStore>) => void;
  setCurrentModule: (id: string | null) => void;
  completeModule: (id: string) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      sessionId: null,
      country: "",
      knowledgeLevel: "beginner",
      goal: "understand",
      isOnboarded: false,
      currentModule: null,
      completedModules: [],
      language: "en",
      setSession: (s) => set(s),
      setCurrentModule: (id) => set({ currentModule: id }),
      completeModule: (id) =>
        set((state) => ({
          completedModules: state.completedModules.includes(id)
            ? state.completedModules
            : [...state.completedModules, id],
        })),
      reset: () =>
        set({
          sessionId: null, country: "", knowledgeLevel: "beginner",
          goal: "understand", isOnboarded: false, currentModule: null,
          completedModules: [], language: "en",
        }),
    }),
    { name: "electra-session" }
  )
);

/* ── Chat Store ───────────────────────────────────────────────────── */
interface ChatStore {
  messages: Message[];
  isStreaming: boolean;
  addMessage: (msg: Message) => void;
  appendToLastMessage: (token: string) => void;
  setStreaming: (v: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  messages: [],
  isStreaming: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  appendToLastMessage: (token) =>
    set((s) => {
      const msgs = [...s.messages];
      if (msgs.length > 0) {
        const last = { ...msgs[msgs.length - 1] };
        last.content += token;
        last.isStreaming = true;
        msgs[msgs.length - 1] = last;
      }
      return { messages: msgs };
    }),
  setStreaming: (v) =>
    set((s) => {
      if (!v && s.messages.length > 0) {
        const msgs = [...s.messages];
        const last = { ...msgs[msgs.length - 1], isStreaming: false };
        msgs[msgs.length - 1] = last;
        return { isStreaming: v, messages: msgs };
      }
      return { isStreaming: v };
    }),
  clearChat: () => set({ messages: [], isStreaming: false }),
}));

/* ── UI Store ─────────────────────────────────────────────────────── */
interface UIStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (v) => set({ isSidebarOpen: v }),
}));
