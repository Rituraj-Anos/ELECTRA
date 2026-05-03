/**
 * @fileoverview Shared TypeScript interfaces for the ELECTRA frontend
 * Re-exports from lib/types and adds additional shared types.
 */

// Re-export all existing types from lib/types
export type { KnowledgeLevel, LearningGoal, SessionState, Message, LearningModule, ContentSection, QuizQuestion, QuizResult, QuizFeedback, TimelineEvent, GlossaryTerm, PollingLocation, Country } from '../lib/types';
export { COUNTRIES } from '../lib/types';

/**
 * @description User chat message with strict role typing
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * @description A voter readiness checklist item
 */
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: string;
  icon: string;
}

/**
 * @description Module alias for LearningModule for use in api.ts
 */
export type { LearningModule as Module } from '../lib/types';

/**
 * @description Result from the scenario simulation API
 */
export interface ScenarioResult {
  scenario?: string;
  country?: string;
  analysis?: string;
  outcome?: string;
  id?: string;
  title?: string;
  description?: string;
  category?: string;
}
