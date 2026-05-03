/**
 * @fileoverview User Model — MongoDB/Mongoose schema
 * Stores user profiles with authentication and preferences.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  authProvider: 'anonymous' | 'email' | 'google';
  country: string;
  state?: string;
  knowledgeLevel: 'beginner' | 'intermediate' | 'expert';
  language: string;
  completedModules: string[];
  totalQuestionsAsked: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true },
    displayName: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    authProvider: {
      type: String,
      enum: ['anonymous', 'email', 'google'],
      default: 'anonymous',
    },
    country: { type: String, default: '' },
    state: { type: String, default: '' },
    knowledgeLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      default: 'beginner',
    },
    language: { type: String, default: 'en' },
    completedModules: { type: [String], default: [] },
    totalQuestionsAsked: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
