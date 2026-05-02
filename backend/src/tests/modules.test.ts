import * as fs from 'fs';
import * as path from 'path';

describe('Modules Data Validation', () => {
  let modulesData: any[];

  beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'modules.json');
    modulesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  });

  test('returns array of modules', () => {
    expect(modulesData).toBeInstanceOf(Array);
    expect(modulesData.length).toBeGreaterThan(0);
  });

  test('modules have required schema fields', () => {
    for (const mod of modulesData) {
      expect(mod).toHaveProperty('id');
      expect(mod).toHaveProperty('title');
      expect(mod).toHaveProperty('description');
      expect(mod).toHaveProperty('country');
      expect(mod).toHaveProperty('order');
      expect(mod).toHaveProperty('estimatedMinutes');
      expect(mod).toHaveProperty('content');
      expect(mod).toHaveProperty('quizQuestions');
    }
  });

  test('module IDs are unique', () => {
    const ids = modulesData.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('modules are ordered correctly', () => {
    for (let i = 0; i < modulesData.length - 1; i++) {
      expect(modulesData[i].order).toBeLessThan(modulesData[i + 1].order);
    }
  });

  test('content sections have valid types', () => {
    const validTypes = ['heading', 'body', 'callout', 'steps', 'note'];
    for (const mod of modulesData) {
      for (const section of mod.content) {
        expect(validTypes).toContain(section.type);
      }
    }
  });

  test('country filter works for ALL', () => {
    const allModules = modulesData.filter(m => m.country === 'ALL');
    expect(allModules.length).toBe(8);
  });
});

describe('Glossary Data Validation', () => {
  let glossaryData: any[];

  beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'glossary.json');
    glossaryData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  });

  test('glossary has 30+ terms', () => {
    expect(glossaryData.length).toBeGreaterThanOrEqual(30);
  });

  test('glossary terms have required fields', () => {
    for (const term of glossaryData) {
      expect(term).toHaveProperty('id');
      expect(term).toHaveProperty('term');
      expect(term).toHaveProperty('definition');
      expect(term).toHaveProperty('category');
    }
  });
});

describe('Timeline Data Validation', () => {
  let timelinesData: any;

  beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'timelines.json');
    timelinesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  });

  test('has US presidential timeline', () => {
    expect(timelinesData).toHaveProperty('US_presidential');
    expect(timelinesData.US_presidential.length).toBeGreaterThan(0);
  });

  test('has UK general timeline', () => {
    expect(timelinesData).toHaveProperty('UK_general');
  });

  test('timeline events have required fields', () => {
    for (const event of timelinesData.US_presidential) {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('category');
      expect(event).toHaveProperty('order');
    }
  });
});
