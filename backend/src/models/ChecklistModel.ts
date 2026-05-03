/**
 * @fileoverview Checklist Model — MongoDB/Mongoose schema
 * Stores per-user voter readiness checklist state.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: Date;
}

export interface IChecklist extends Document {
  userId: string;
  items: IChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { _id: false }
);

const ChecklistSchema = new Schema<IChecklist>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: { type: [ChecklistItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Checklist = mongoose.model<IChecklist>('Checklist', ChecklistSchema);
