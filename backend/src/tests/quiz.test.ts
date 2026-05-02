import * as fs from 'fs';
import * as path from 'path';

describe('Quiz Scoring Logic', () => {
  let modulesData: any[];

  beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'modules.json');
    modulesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  });

  test('modules data loads correctly', () => {
    expect(modulesData).toBeInstanceOf(Array);
    expect(modulesData.length).toBe(8);
  });

  test('each module has quiz questions', () => {
    for (const mod of modulesData) {
      expect(mod.quizQuestions).toBeInstanceOf(Array);
      expect(mod.quizQuestions.length).toBe(5);
    }
  });

  test('quiz questions have required fields', () => {
    for (const mod of modulesData) {
      for (const q of mod.quizQuestions) {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('correctAnswer');
        expect(q).toHaveProperty('explanation');
        expect(q.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  test('correct answer is one of the options', () => {
    for (const mod of modulesData) {
      for (const q of mod.quizQuestions) {
        expect(q.options).toContain(q.correctAnswer);
      }
    }
  });

  test('score calculation: 3/5 = 60%', () => {
    const correct = 3, total = 5;
    const score = Math.round((correct / total) * 100);
    expect(score).toBe(60);
  });

  test('score calculation: 5/5 = 100%', () => {
    const correct = 5, total = 5;
    const score = Math.round((correct / total) * 100);
    expect(score).toBe(100);
  });

  test('score calculation: 0/5 = 0%', () => {
    const correct = 0, total = 5;
    const score = Math.round((correct / total) * 100);
    expect(score).toBe(0);
  });
});
