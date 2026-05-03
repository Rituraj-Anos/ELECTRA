/**
 * @fileoverview Quiz Result Model — MongoDB/Mongoose schema
 * Stores quiz attempt results per user per module.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizResult extends Document {
  userId: string;
  moduleId: string;
  score: number;
  total: number;
  percentage: number;
  answers: { questionId: string; selected: string; correct: boolean }[];
  completedAt: Date;
}

const AnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    selected: { type: String, required: true },
    correct: { type: Boolean, required: true },
  },
  { _id: false }
);

const QuizResultSchema = new Schema<IQuizResult>(
  {
    userId: { type: String, required: true, index: true },
    moduleId: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answers: { type: [AnswerSchema], default: [] },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QuizResultSchema.index({ userId: 1, moduleId: 1 });

export const QuizResult = mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
