# 🗳️ ELECTRA — Election Process Education Assistant
## COMPLETE MASTER PRD + IMPLEMENTATION PROMPT
### Challenge 2 | Google Antigravity Hackathon | Target: Top 100

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PART 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 1.1 Executive Summary

**Product Name:** ELECTRA — The Election Intelligence Assistant  
**Tagline:** *"Your step-by-step guide to every vote that matters."*  
**Type:** Full-stack AI-powered web application  
**Deployment:** Google Cloud Run  
**Primary AI:** Google Gemini 2.0 Flash (via Vertex AI) — satisfies "Google Services" evaluation criterion  
**Secondary AI:** Claude claude-sonnet-4-20250514 API (for deep Q&A fallback)  
**Frontend:** Next.js 14 (App Router) + TypeScript  
**Backend:** Node.js (Express) containerized on Cloud Run  
**Database:** Firebase Firestore  
**Evaluation Focus Areas Targeted:** Code Quality ★★★ | Security ★★★ | Efficiency ★★★ | Testing ★★★ | Accessibility ★★★ | Google Services ★★★

---

### 1.2 Problem Statement

Millions of first-time voters, students, civics educators, and new citizens struggle to understand election processes. Information is scattered across government websites, written in dense legalese, and rarely personalized to a user's specific country, state, or situation. ELECTRA solves this with a conversational AI tutor that explains every step — from voter registration to ballot counting — in plain language, with timelines, quizzes, and visual aids.

---

### 1.3 Target Users

| Persona | Description | Key Need |
|---|---|---|
| First-time voter | 18-year-old voting for the first time | Step-by-step registration guide |
| Civics student | High school/college student | Structured educational content |
| New citizen | Recently naturalized, unfamiliar with local process | Country-specific guidance |
| Educator | Teacher looking for classroom material | Shareable, structured modules |
| Curious citizen | Adult who wants to understand how counting works | Deep explanations on demand |

---

### 1.4 Core Features

#### Feature Set A — AI Assistant (MVP Core)
- **Conversational Q&A**: Ask anything about elections in natural language
- **Context-Aware Responses**: User selects their country/region → answers are localized
- **Guided Learning Paths**: Structured multi-step modules (e.g., "Voter Registration 101")
- **Timeline Visualizer**: Interactive election timeline generator based on selected election type
- **Glossary Mode**: Instant plain-English definitions for political/legal terms
- **Quiz Engine**: After each module, a 3-5 question quiz to test understanding

#### Feature Set B — Google Services Integration (Differentiator)
- **Gemini 2.0 Flash**: Primary LLM for all AI responses (Vertex AI API)
- **Google Translate API**: Real-time translation of all content into 20+ languages
- **Google Text-to-Speech API**: Read-aloud accessibility feature for every AI response
- **Firebase Firestore**: Persist conversation sessions, quiz scores, and user progress
- **Firebase Authentication** (Anonymous): Session management without requiring sign-up
- **Google Analytics 4**: Track feature usage for product improvement
- **Google Cloud Storage**: Store election documents, PDFs, reference materials
- **Google Maps Embed API**: Show nearby polling locations (via user zip/postal code)
- **Cloud Run**: Containerized backend deployment

#### Feature Set C — UX Excellence
- **Onboarding Flow**: 3-step setup (country → knowledge level → learning goal)
- **Progress Dashboard**: Visual progress through election education modules
- **Bookmark System**: Save any answer/topic for later review
- **Share Feature**: Generate shareable links to specific election explanations
- **Mobile-first Responsive**: Full PWA support with offline cached content
- **Dark/Light Mode**: Automatic + manual toggle
- **Keyboard Navigation**: Full WCAG 2.1 AA compliance

---

### 1.5 Information Architecture

```
ELECTRA App
├── / (Landing Page)
│   ├── Hero: "Understand how elections work, step by step"
│   ├── Feature highlights
│   ├── Country selector
│   └── CTA: "Start Learning"
│
├── /onboard (3-step wizard)
│   ├── Step 1: Select country/region
│   ├── Step 2: Select knowledge level (Beginner / Intermediate / Expert)
│   └── Step 3: Select goal (Register to Vote / Understand the Process / Teach Others)
│
├── /learn (Main Learning Hub)
│   ├── Sidebar: Module list
│   ├── Module viewer: Current lesson content
│   ├── AI assistant panel (slide-in)
│   └── Progress tracker (top bar)
│
├── /chat (AI Assistant — full-page)
│   ├── Conversation thread
│   ├── Suggested questions chips
│   ├── Language selector
│   ├── TTS toggle
│   └── Source citations panel
│
├── /timeline (Election Timeline Visualizer)
│   ├── Election type selector (Presidential / Local / Primary / Referendum)
│   ├── Country/state input
│   └── Interactive horizontal timeline with milestones
│
├── /quiz (Quiz Engine)
│   ├── Module-based quizzes
│   ├── Score display + explanation of wrong answers
│   └── Leaderboard (anonymous, Firestore-backed)
│
├── /glossary (Election Glossary)
│   ├── A-Z searchable terms
│   └── AI-powered "explain like I'm 5" toggle
│
└── /polling (Polling Locator)
    ├── Zip/postal code input
    ├── Google Maps embed
    └── Opening hours + accessibility info
```

---

### 1.6 Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js 14)                   │
│  React Server Components + Client Components (TypeScript) │
│  Deployed: Vercel or Cloud Run (static export)           │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS REST + SSE (streaming)
┌────────────────────▼────────────────────────────────────┐
│                BACKEND API (Node.js/Express)              │
│              Containerized → Google Cloud Run            │
│                                                          │
│  Routes:                                                 │
│  POST /api/chat         → Gemini 2.0 Flash via Vertex AI │
│  POST /api/translate    → Google Translate API           │
│  POST /api/tts          → Google Text-to-Speech          │
│  GET  /api/modules      → Firebase Firestore             │
│  POST /api/quiz/submit  → Firebase Firestore             │
│  GET  /api/timeline     → Static JSON + AI generation    │
│  GET  /api/polling      → Maps API proxy                 │
└──┬──────────┬──────────┬──────────────────┬─────────────┘
   │          │          │                  │
   ▼          ▼          ▼                  ▼
Vertex AI  Google     Google           Firebase
(Gemini)  Translate  Text-to-Speech   Firestore
```

---

### 1.7 Data Models

#### Firestore Collections

```typescript
// Collection: sessions
interface Session {
  id: string;                    // Anonymous Firebase Auth UID
  country: string;               // "US", "IN", "UK", etc.
  knowledgeLevel: "beginner" | "intermediate" | "expert";
  goal: "register" | "understand" | "teach";
  language: string;              // ISO 639-1 code
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
  completedModules: string[];    // Module IDs
  bookmarks: Bookmark[];
}

// Collection: conversations
interface ConversationMessage {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  translatedContent?: string;
  timestamp: Timestamp;
  moduleContext?: string;
  sources?: Citation[];
}

// Collection: quizResults
interface QuizResult {
  sessionId: string;
  moduleId: string;
  score: number;               // 0-100
  answers: { questionId: string; correct: boolean }[];
  completedAt: Timestamp;
}

// Collection: modules (seeded data)
interface LearningModule {
  id: string;
  title: string;
  description: string;
  country: string;             // "ALL" or specific country code
  order: number;
  estimatedMinutes: number;
  content: ModuleSection[];
  quizQuestions: QuizQuestion[];
}
```

---

### 1.8 AI Prompt Architecture

#### System Prompt for Gemini (Vertex AI)

```
You are ELECTRA, an expert, friendly, and non-partisan election education assistant.
Your role is to help users understand election processes, timelines, voting rights, 
ballot systems, and civic participation — clearly and accurately.

RULES:
1. NEVER express political opinions or favor any party, candidate, or ideology.
2. ALWAYS cite your source type (e.g., "Based on [Country] Election Commission guidelines...")
3. Adapt complexity to the user's stated knowledge level: {{knowledgeLevel}}
4. The user is asking about elections in: {{country}}
5. If you don't know something country-specific, say so and direct to official sources.
6. Format responses with clear structure: use numbered steps for processes, 
   bullet points for lists, and bold for key terms.
7. Keep responses under 300 words unless the user asks for detail.
8. End every response with 1 relevant follow-up question to encourage learning.
9. For registration/voting questions, always include official website URLs.
10. Never fabricate election dates, laws, or statistics.

CURRENT CONVERSATION CONTEXT:
Module: {{currentModule}}
Previous context: {{conversationHistory}}
```

---

### 1.9 Module Content (Seeded Data — 8 Core Modules)

| # | Module | Topics Covered | Est. Time |
|---|--------|----------------|-----------|
| 1 | Voter Registration | Eligibility, deadlines, how to register, ID requirements | 8 min |
| 2 | Types of Elections | Presidential, congressional, local, primary, referendum | 6 min |
| 3 | How Voting Works | Polling places, ballot types, absentee/mail-in, early voting | 10 min |
| 4 | Electoral Systems | First-past-the-post, proportional, ranked-choice explained | 12 min |
| 5 | The Election Timeline | Campaign period → Election Day → Counting → Certification | 8 min |
| 6 | How Votes Are Counted | Hand count, machines, observers, recounts | 9 min |
| 7 | Election Security | Safeguards, audits, chain of custody | 7 min |
| 8 | After the Election | Transition of power, electoral college (US), certification | 8 min |

---

### 1.10 API Endpoints Specification

```
POST /api/chat
Body: { message: string, sessionId: string, language: string, moduleContext?: string }
Response: Stream<string> (SSE)
Auth: Firebase ID token (anonymous)

POST /api/translate
Body: { text: string, targetLanguage: string }
Response: { translatedText: string }

POST /api/tts
Body: { text: string, language: string }
Response: { audioContent: string } // base64 MP3

GET /api/modules?country=US&level=beginner
Response: { modules: LearningModule[] }

POST /api/quiz/submit
Body: { sessionId: string, moduleId: string, answers: Answer[] }
Response: { score: number, feedback: QuizFeedback[] }

GET /api/timeline?country=US&electionType=presidential
Response: { events: TimelineEvent[] }

GET /api/polling?postalCode=10001&country=US
Response: { locations: PollingLocation[] }
```

---

### 1.11 Security Implementation

- **No user PII collected** — Firebase Anonymous Auth only
- **API key rotation** — All Google API keys stored in Cloud Run Secret Manager
- **Rate limiting** — 60 requests/minute per session (express-rate-limit)
- **Input sanitization** — All user input sanitized before Gemini prompt injection
- **CORS** — Strict origin whitelist on backend
- **CSP headers** — Content Security Policy on all responses
- **No prompt injection** — User message wrapped in safe XML tags before sending to Gemini
- **HTTPS only** — Cloud Run enforces TLS
- **Dependency scanning** — npm audit in CI/CD pipeline

---

### 1.12 Testing Strategy

```
Unit Tests (Jest + Testing Library):
├── AI prompt builder functions
├── Quiz scoring logic
├── Timeline event generation
├── Translation fallback logic
└── Firestore service layer

Integration Tests (Supertest):
├── POST /api/chat (mock Vertex AI)
├── POST /api/quiz/submit
├── GET /api/modules
└── GET /api/timeline

E2E Tests (Playwright):
├── Onboarding flow completion
├── Full chat conversation
├── Module completion + quiz
└── Language switching

Accessibility Tests (axe-core + jest-axe):
├── All pages WCAG 2.1 AA
├── Screen reader compatibility
├── Keyboard navigation
└── Color contrast ratios

Performance:
├── Lighthouse CI (target: 90+ all categories)
└── Core Web Vitals tracking via GA4
```

---

### 1.13 Accessibility Requirements (WCAG 2.1 AA)

- All interactive elements have ARIA labels
- Focus management on modal/drawer open/close
- Skip navigation links
- Alt text on all images
- Color contrast ratio ≥ 4.5:1 for text
- TTS (Text-to-Speech) on every AI response via Google TTS API
- Keyboard-navigable quiz and timeline
- Reduced-motion media query respected for all animations
- Language attribute set correctly for Translate API responses

---

### 1.14 Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.0s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.0s |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| First AI Response (streaming) | < 1.5s to first token |

---

### 1.15 Deployment Architecture (Cloud Run)

```yaml
# Cloud Run Service Config
name: electra-backend
region: us-central1
min-instances: 1
max-instances: 10
memory: 512Mi
cpu: 1
concurrency: 80
timeout: 60s
environment-variables:
  - GOOGLE_CLOUD_PROJECT
  - VERTEX_AI_LOCATION
  - FIREBASE_PROJECT_ID
secrets:
  - VERTEX_AI_API_KEY (Secret Manager)
  - GOOGLE_TRANSLATE_API_KEY (Secret Manager)
  - GOOGLE_TTS_API_KEY (Secret Manager)
  - GOOGLE_MAPS_API_KEY (Secret Manager)
```

---

### 1.16 README Structure (Required for Submission)

```markdown
# ELECTRA — Election Process Education Assistant

## Chosen Vertical
Election Process Education

## Approach & Logic
[Describe the AI pipeline, Gemini integration, modular learning design]

## How It Works
1. User onboards → selects country, knowledge level, goal
2. Gemini 2.0 Flash (Vertex AI) powers all AI responses with localized election data
3. Firebase Firestore tracks progress across sessions
4. Google Translate enables multilingual access
5. Google TTS provides audio accessibility
6. Modules + quizzes create structured learning paths
7. Timeline visualizer generates country-specific election calendars

## Google Services Used
- Vertex AI (Gemini 2.0 Flash)
- Firebase Firestore + Auth
- Google Translate API
- Google Text-to-Speech API
- Google Maps Embed API
- Google Analytics 4
- Cloud Run (deployment)
- Secret Manager (API key security)

## Assumptions
- [List assumptions about data availability, election coverage, etc.]

## Local Setup
[Step by step instructions]

## Live Demo
[Cloud Run URL]
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PART 2: COMPLETE MASTER IMPLEMENTATION PROMPT
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> **PASTE THIS ENTIRE PROMPT INTO GOOGLE ANTIGRAVITY / YOUR AI CODING TOOL**

---

```
You are a world-class full-stack engineer and product designer. Build ELECTRA — a complete,
production-grade Election Process Education assistant web application. 

Follow every instruction below with zero shortcuts. This is a hackathon submission targeting 
top 100 out of 16,876 participants. Quality, completeness, and differentiation are everything.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 0: SETUP SKILL REPOS (DO THIS FIRST — NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Navigate to the frontend directory and clone all 4 skill repositories:

  cd frontend
  git clone https://github.com/google-labs-code/stitch-skills
  git clone https://github.com/motiondivision/motion
  git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  git clone https://github.com/pbakaus/impeccable

MANDATORY BEFORE TOUCHING ANY COMPONENT:
1. Read README.md of EVERY cloned repo completely
2. For EVERY component you build → use Stitch MCP to scaffold it first
3. For EVERY animation/interaction → reference 21st.dev MCP for polish patterns
4. Apply design tokens, micro-interaction rules, and implementation patterns from all 4 
   skill repos throughout the ENTIRE build
5. These are not reference-only — patterns from these repos MUST be visible in every 
   component's code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: PROJECT INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create the following monorepo structure:

electra/
├── frontend/                  # Next.js 14 App Router + TypeScript
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   ├── onboard/page.tsx   # 3-step onboarding wizard
│   │   ├── learn/page.tsx     # Learning hub
│   │   ├── chat/page.tsx      # Full-page AI chat
│   │   ├── timeline/page.tsx  # Election timeline visualizer
│   │   ├── quiz/page.tsx      # Quiz engine
│   │   ├── glossary/page.tsx  # Election glossary
│   │   └── polling/page.tsx   # Polling locator
│   ├── components/
│   │   ├── ui/                # Reusable primitives
│   │   ├── chat/              # Chat-specific components
│   │   ├── timeline/          # Timeline components
│   │   ├── quiz/              # Quiz components
│   │   └── layout/            # Header, sidebar, footer
│   ├── lib/
│   │   ├── firebase.ts        # Firebase client setup
│   │   ├── api.ts             # API client functions
│   │   ├── store.ts           # Zustand global state
│   │   └── types.ts           # TypeScript interfaces
│   ├── public/
│   └── package.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── index.ts           # Express app entry
│   │   ├── routes/
│   │   │   ├── chat.ts        # POST /api/chat (Vertex AI Gemini)
│   │   │   ├── translate.ts   # POST /api/translate
│   │   │   ├── tts.ts         # POST /api/tts
│   │   │   ├── modules.ts     # GET /api/modules
│   │   │   ├── quiz.ts        # POST /api/quiz/submit
│   │   │   ├── timeline.ts    # GET /api/timeline
│   │   │   └── polling.ts     # GET /api/polling
│   │   ├── services/
│   │   │   ├── gemini.ts      # Vertex AI Gemini service
│   │   │   ├── translate.ts   # Google Translate service
│   │   │   ├── tts.ts         # Google TTS service
│   │   │   ├── firestore.ts   # Firebase Admin SDK
│   │   │   └── maps.ts        # Google Maps service
│   │   ├── middleware/
│   │   │   ├── auth.ts        # Firebase token verification
│   │   │   ├── rateLimit.ts   # Rate limiting (60 req/min/session)
│   │   │   ├── sanitize.ts    # Input sanitization
│   │   │   └── security.ts    # CORS, CSP, helmet
│   │   ├── data/
│   │   │   ├── modules.json   # 8 seeded learning modules
