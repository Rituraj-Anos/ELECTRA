    input: { text: cleanText },
    voice: {
      languageCode,
      name: `${languageCode}-Neural2-D`,  // Use Neural2 voices for quality
      ssmlGender: 'NEUTRAL',
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      pitch: 0,
    },
  });
  
  return Buffer.from(response.audioContent as Uint8Array).toString('base64');
}
```

### 4.6 Firebase Admin Setup

```typescript
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export const db = admin.firestore();
export const auth = admin.auth();
```

### 4.7 Input Sanitization Middleware

```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  // Remove HTML
  let clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  // Remove potential prompt injection patterns
  clean = clean.replace(/```/g, '');
  clean = clean.replace(/\[SYSTEM\]|\[INST\]|<s>|<\/s>/gi, '');
  // Truncate
  return clean.substring(0, 500).trim();
}
```

### 4.8 Seeded Module Data (backend/src/data/modules.json)

Create full JSON for 8 modules. Each module must include:
- id, title, description, country, order, estimatedMinutes
- content: array of sections (type: 'heading' | 'body' | 'callout' | 'steps' | 'note')
- quizQuestions: 5 questions each with 4 options, correct answer, explanation
- relatedGlossaryTerms: array of term IDs

Populate all 8 modules with real, accurate election education content. 
Module topics as defined in PRD Section 1.9.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: STATE MANAGEMENT (frontend/lib/store.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use Zustand. Create the following stores:

```typescript
// User session store
interface SessionStore {
  sessionId: string | null;
  country: string;
  knowledgeLevel: 'beginner' | 'intermediate' | 'expert';
  goal: 'register' | 'understand' | 'teach';
  language: string;
  completedModules: string[];
  currentModule: string | null;
  setSession: (data: Partial<SessionStore>) => void;
  resetSession: () => void;
}

// Chat store
interface ChatStore {
  messages: Message[];
  isStreaming: boolean;
  isTranslating: boolean;
  addMessage: (msg: Message) => void;
  updateLastMessage: (token: string) => void;
  clearMessages: () => void;
}

// UI store
interface UIStore {
  isChatPanelOpen: boolean;
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  isPlayingTTS: boolean;
  setChatPanelOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
}
```

Persist session store to localStorage and sync to Firestore on change.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6: REUSABLE COMPONENT LIBRARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build these reusable components (scaffold each with Stitch MCP first):

Button:
  Variants: primary (amber fill) | secondary (outlined) | ghost | danger
  Sizes: sm | md | lg
  States: default | hover | active | disabled | loading (spinner)
  Must include: aria-label support, keyboard focus ring, loading state

Card:
  Variants: default | elevated | bordered | interactive (hover lift)
  Props: children, className, onClick, href (auto Link vs div)

Input:
  Types: text | search | select | textarea
  States: default | focus | error | success | disabled
  Must include: label, helperText, errorMessage, required indicator

Badge:
  Variants: default | amber | green | red | blue | gray
  Sizes: sm | md

ProgressBar:
  Props: value (0-100), color, animated (boolean), label

Chip/Tag:
  For categories, languages, module tags
  Closable variant

Modal:
  Focus trap, close on Escape, backdrop click to close
  Animation: scale + fade in

Toast Notifications:
  Types: success | error | info | warning
  Auto-dismiss after 4s
  Position: top-right
  Animation: slide in from right

Spinner/Loader:
  Used during AI streaming wait
  Variants: circle | dots (for typing indicator)

CountryFlag:
  Emoji-based flag component with country code prop
  Fallback to country name if emoji not supported

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7: KEY ANIMATIONS (reference Motion library + 21st.dev patterns)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Apply these specific animations throughout the app:

1. PAGE TRANSITIONS: Crossfade with 200ms opacity + 20px Y translate
2. HERO ENTRANCE: Staggered fade-up (80ms delay between each element)
3. CARD HOVER: translateY(-4px) + box-shadow deepens, 200ms ease-out
4. BUTTON PRESS: scale(0.97) on mousedown, spring back on release
5. CHAT BUBBLE ENTRANCE: Scale from 0.8 + fade, 250ms spring ease
6. TYPING INDICATOR: 3 dots with phase-shifted scale pulses (0.4s each)
7. QUIZ ANSWER REVEAL: Color flood fill animation from center outward
8. CONFETTI: SVG confetti burst on correct answer (pure CSS keyframes, 30 particles)
9. PROGRESS BAR: Width transition with ease-out, 600ms
10. TIMELINE CARDS: Slide up from Y+20px on scroll intersection (IntersectionObserver)
11. MODULE COMPLETION: Checkmark SVG draw animation (stroke-dasharray trick)
12. SCORE CIRCLE: SVG arc animation from 0 to final % (requestAnimationFrame)
13. SIDEBAR SLIDE: translateX from -280px to 0, 300ms ease-out
14. CHAT PANEL SLIDE: translateX from +400px to 0, 350ms spring
15. LANGUAGE SELECTOR: Dropdown with scale-y from 0.9 + opacity, 200ms

All animations MUST respect prefers-reduced-motion:
@media (prefers-reduced-motion: reduce) { all animations duration: 0ms }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8: ACCESSIBILITY (WCAG 2.1 AA — NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implement ALL of the following:

1. SKIP NAVIGATION: First element in <body> must be 
   <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
2. ARIA LIVE REGIONS: Chat thread wrapped in <div aria-live="polite"> so screen 
   readers announce new AI responses
3. ARIA LABELS: Every icon button must have aria-label
4. FOCUS MANAGEMENT: When modal opens, focus first interactive element inside it.
   When modal closes, return focus to trigger element.
5. HEADING HIERARCHY: Every page must have exactly one h1, then h2, h3 in order
6. LANDMARK ROLES: <header>, <main id="main-content">, <nav>, <aside>, <footer>
7. FORM LABELS: Every input has associated <label> with htmlFor matching input id
8. ERROR MESSAGES: aria-describedby linking input to error message element
9. COLOR INDEPENDENCE: Never convey information by color alone (add icon/text)
10. CONTRAST RATIO: Verify all text/background combos ≥ 4.5:1 using WebAIM calculator
11. KEYBOARD: Tab through everything. Enter/Space activates buttons. Arrow keys for 
    quiz options. Escape closes modals.
12. IMAGE ALT: All <img> and SVG illustrations have descriptive alt text
13. LANGUAGE: <html lang="en"> updates dynamically when user changes language
14. FOCUS VISIBLE: Custom focus ring: outline: 2px solid var(--color-amber); 
    outline-offset: 2px; never outline: none without replacement
15. TABLE HEADERS: Glossary table uses <th scope="col"> for column headers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9: TESTING IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these test files:

backend/src/tests/chat.test.ts:
- Test sanitizeInput() removes HTML and injection patterns
- Test buildSystemInstruction() includes country and level
- Test rate limiting returns 429 after limit
- Mock Vertex AI, test streaming response format

backend/src/tests/quiz.test.ts:
- Test score calculation (3/5 = 60%)
- Test answer validation
- Test Firestore write called with correct data
- Test invalid sessionId returns 401

backend/src/tests/modules.test.ts:
- Test GET /api/modules returns array
- Test country filtering
- Test level filtering
- Test module JSON schema validation

frontend tests (Jest + React Testing Library):
frontend/__tests__/components/Button.test.tsx:
- Renders with correct label
- Calls onClick when clicked
- Shows spinner when loading
- Has aria-label when provided

frontend/__tests__/pages/Quiz.test.tsx:
- Shows question after start
- Selects answer and shows feedback
- Advances to next question
- Shows results screen after all questions

frontend/__tests__/lib/store.test.ts:
- setSession updates state
- completedModules array updated correctly
- Reset clears all state

Run: npm test --coverage (target >80% coverage)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 10: DOCKER + CLOUD RUN DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

backend/Dockerfile:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/data ./dist/data
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

.github/workflows/deploy.yml:
```yaml
name: Deploy to Cloud Run
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: electra-backend
          region: us-central1
          source: ./backend
          env_vars: |
            GOOGLE_CLOUD_PROJECT=${{ secrets.GCP_PROJECT }}
            FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }}
            FRONTEND_URL=${{ secrets.FRONTEND_URL }}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 11: ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

backend/.env.example:
  PORT=8080
  NODE_ENV=development
  GOOGLE_CLOUD_PROJECT=your-project-id
  VERTEX_AI_LOCATION=us-central1
  FIREBASE_PROJECT_ID=your-firebase-project
  GOOGLE_TRANSLATE_API_KEY=
  GOOGLE_TTS_API_KEY=
  GOOGLE_MAPS_API_KEY=
  FRONTEND_URL=http://localhost:3000

frontend/.env.example:
  NEXT_PUBLIC_API_URL=http://localhost:8080
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
  NEXT_PUBLIC_GA_MEASUREMENT_ID=

All secrets in production go to Google Secret Manager, referenced in Cloud Run config.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 12: README.md (ROOT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write a professional, comprehensive README.md that includes:

# ELECTRA — Election Process Education Assistant
## Challenge 2 | Google Antigravity Hackathon

[Add an ASCII art logo or badge]

### Demo
🌐 Live: [Cloud Run URL]
📹 Video Walkthrough: [Link]

### Overview
[2-3 paragraph description]

### Chosen Vertical
Election Process Education

### Google Services Used
| Service | Purpose |
|---------|---------|
| Vertex AI (Gemini 2.0 Flash) | Core AI for all conversational responses |
| Firebase Firestore | Session persistence, quiz results, progress |
| Firebase Authentication | Anonymous session management |
| Google Translate API | Multilingual content (20+ languages) |
| Google Text-to-Speech API | Accessibility audio feature |
| Google Maps Embed API | Polling location finder |
| Google Analytics 4 | Usage tracking, feature analytics |
| Google Cloud Run | Backend containerized deployment |
| Google Secret Manager | Secure API key storage |

### Architecture
[Diagram as ASCII art]

### Features
[Full feature list with emojis]

### Approach & Logic
[Technical decisions, AI prompt design, module architecture]

### Local Setup
Prerequisites:
- Node.js 20+
- Google Cloud account with billing enabled
- Firebase project
- All Google APIs enabled

Steps:
1. Clone repo
2. Setup backend: cd backend && npm install && cp .env.example .env
3. Setup frontend: cd frontend && npm install && cp .env.example .env
4. Fill in all environment variables
5. Run: cd backend && npm run dev (port 8080)
6. Run: cd frontend && npm run dev (port 3000)

### Deployment
[Cloud Run deployment steps]

### Testing
npm test (backend)
npm test (frontend)

### Assumptions
[List of assumptions]

### License
MIT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 13: GOOGLE ANALYTICS 4 INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add GA4 tracking for these events:
- onboarding_completed (country, level, goal)
- module_started (moduleId)
- module_completed (moduleId, timeSpent)
- quiz_completed (moduleId, score)
- chat_message_sent (messageLength, language)
- tts_played (language)
- translate_used (targetLanguage)
- timeline_viewed (country, electionType)
- glossary_searched (searchTerm)
- polling_location_searched (country)

Create frontend/lib/analytics.ts with typed event tracking functions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 14: FINAL POLISH CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before submission, verify:

☐ All pages load without console errors
☐ Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
☐ All 8 Google Services are provably integrated (not just listed)
☐ AI responses stream correctly with no CORS errors
☐ Quiz scores save to Firestore and persist on refresh
☐ Language translation works end-to-end
☐ TTS plays audio for AI responses
☐ Onboarding persists to Firestore session
☐ Module progress tracked and displayed
☐ Timeline renders for at least 3 countries
☐ Glossary search returns correct results
☐ Maps embed loads with API key
☐ All tests pass: npm test (backend + frontend)
☐ Docker build succeeds: docker build ./backend
☐ Cloud Run deployment successful
☐ Environment variables not committed to git (.gitignore verified)
☐ README is complete with live demo URL
☐ Repository is public, single branch (main), under 10MB
☐ prefers-reduced-motion respected in all animations
☐ Tab through entire app without touching mouse — fully keyboard navigable
☐ npm audit shows no high/critical vulnerabilities
☐ All 4 skill repo patterns visibly applied in component code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIFFERENTIATORS THAT WILL WIN TOP 100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. STREAMING AI: Most submissions use fetch() and wait for full response.
   ELECTRA streams token by token with SSE — feels alive and professional.

2. 9 GOOGLE SERVICES: Most submissions use 2-3. Using 9 provably shows 
   deep Google ecosystem integration.

3. REAL MODULE CONTENT: Most submissions have placeholder content.
   ELECTRA has 8 fully written, educationally accurate modules.

4. MULTILINGUAL + TTS: Very few submissions support 20+ languages with audio.
   This wins the accessibility category outright.

5. QUIZ + LEADERBOARD: Gamification keeps users engaged and demonstrates
   real-world usability.

6. NON-PARTISAN AI DESIGN: The system prompt is carefully designed to be 
   neutral — crucial for election content. This shows maturity and responsibility.

7. VISUAL POLISH: The Civic Modernism design system with Playfair + IBM Plex 
   and the amber/navy palette will stand out in a sea of Tailwind blue apps.

8. SECURITY: Rate limiting, input sanitization, Secret Manager, no PII — 
   most submissions skip security entirely.

9. TESTING: With >80% coverage and E2E tests, ELECTRA is production-grade.

10. TIMELINE VISUALIZER: The interactive election timeline is a unique feature
    that no other education app has — it's the memorable "wow moment".

BEGIN IMPLEMENTATION. DO NOT SKIP ANY STEP. DO NOT USE PLACEHOLDER CONTENT.
BUILD EVERYTHING AS SPECIFIED ABOVE.
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PART 3: SUBMISSION CHECKLIST
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Before You Submit

**GitHub Repository:**
- [ ] Repository is PUBLIC
- [ ] Single branch: `main`
- [ ] Size under 10MB (check: `du -sh .git`)
- [ ] `.env` files NOT committed (`.gitignore` has `*.env`, `.env*`)
- [ ] `node_modules` NOT committed
- [ ] README.md is complete and professional

**Cloud Run URL:**
- [ ] Backend deployed to Cloud Run
- [ ] Frontend deployed (Vercel or Cloud Run static)
- [ ] Both URLs use HTTPS
- [ ] App loads and works end-to-end on the deployed URL

**LinkedIn Post Must Include:**
- [ ] Screenshot of the running app
- [ ] Brief description of what you built
- [ ] Technologies used (highlight Google Services)
- [ ] Link to GitHub repo
- [ ] Link to live app
- [ ] Hashtags: #GoogleAntigravity #ElectionEducation #GeminiAI #CloudRun

### Scoring Strategy

| Criteria | How ELECTRA Scores Maximum |
|---|---|
| Code Quality | TypeScript throughout, clean separation of concerns, consistent naming, documented functions |
| Security | Secret Manager, rate limiting, input sanitization, Firebase auth, HTTPS, no exposed keys |
| Efficiency | Streaming responses, Firestore caching, lazy loading, code splitting, optimized images |
| Testing | Jest unit tests (backend + frontend), >80% coverage, axe-core accessibility tests |
| Accessibility | WCAG 2.1 AA, TTS, keyboard nav, ARIA, screen reader support, Lighthouse ≥ 95 |
| Google Services | 9 services deeply integrated, not just mentioned |

---

*ELECTRA — Built to educate every voter, in every language, in every country.*
*Non-partisan. AI-powered. Accessible. Open-source.*
