/**
 * @fileoverview Chat History Model — MongoDB/Mongoose schema
 * Stores conversation history per user session.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sentiment?: { score: number; label: string };
  timestamp: Date;
}

export interface IChatHistory extends Document {
  userId: string;
  sessionId: string;
  messages: IChatMessage[];
  country: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    sentiment: {
      score: { type: Number },
      label: { type: String },
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatHistorySchema = new Schema<IChatHistory>(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    messages: { type: [ChatMessageSchema], default: [] },
    country: { type: String, default: '' },
    language: { type: String, default: 'en' },
  },
  { timestamps: true }
);

// Compound index for efficient lookups
ChatHistorySchema.index({ userId: 1, sessionId: 1 });

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
