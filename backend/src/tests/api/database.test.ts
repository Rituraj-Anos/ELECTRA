import request from 'supertest';
import app from '../../index';

describe('MongoDB Models & Database', () => {
  describe('Models exist and export correctly', () => {
    it('User model exports without error', () => {
      const { User } = require('../../models/User');
      expect(User).toBeDefined();
      expect(User.modelName).toBe('User');
    });

    it('ChatHistory model exports without error', () => {
      const { ChatHistory } = require('../../models/ChatHistory');
      expect(ChatHistory).toBeDefined();
      expect(ChatHistory.modelName).toBe('ChatHistory');
    });

    it('QuizResult model exports without error', () => {
      const { QuizResult } = require('../../models/QuizResult');
      expect(QuizResult).toBeDefined();
      expect(QuizResult.modelName).toBe('QuizResult');
    });

    it('Checklist model exports without error', () => {
      const { Checklist } = require('../../models/ChecklistModel');
      expect(Checklist).toBeDefined();
      expect(Checklist.modelName).toBe('Checklist');
    });
  });

  describe('Database service', () => {
    it('connectDB function exists', () => {
      const { connectDB } = require('../../services/database');
      expect(typeof connectDB).toBe('function');
    });

    it('isDBConnected returns false when not connected', () => {
      const { isDBConnected } = require('../../services/database');
      expect(isDBConnected()).toBe(false);
    });

    it('connectDB returns false when MONGODB_URI is not set', async () => {
      const origUri = process.env.MONGODB_URI;
      delete process.env.MONGODB_URI;
      const { connectDB } = require('../../services/database');
      const result = await connectDB();
      expect(result).toBe(false);
      if (origUri) process.env.MONGODB_URI = origUri;
    });
  });
});
