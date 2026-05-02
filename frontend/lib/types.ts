/* ═══════════════════════════════════════════════════════════════════
   ELECTRA — Shared TypeScript types
   ═══════════════════════════════════════════════════════════════════ */

export type KnowledgeLevel = "beginner" | "intermediate" | "expert";
export type LearningGoal = "register" | "understand" | "teach";

export interface SessionState {
  sessionId: string;
  country: string;
  knowledgeLevel: KnowledgeLevel;
  goal: LearningGoal;
  isOnboarded: boolean;
  currentModule: string | null;
  completedModules: string[];
  language: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  content: ContentSection[];
  quizQuestions?: QuizQuestion[];
}

export interface ContentSection {
  type: "heading" | "body" | "callout" | "note" | "steps";
  text?: string;
  items?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  performanceLabel: string;
  feedback: QuizFeedback[];
}

export interface QuizFeedback {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  dateRange: string;
  category: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category?: string;
}

export interface PollingLocation {
  id: string;
  name: string;
  address: string;
  hours?: string;
  lat?: number;
  lng?: number;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
];
