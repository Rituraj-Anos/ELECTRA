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
│   │   │   ├── glossary.json  # 150+ election terms
│   │   │   └── timelines.json # Country-specific election timelines
│   │   └── tests/
│   │       ├── chat.test.ts
│   │       ├── quiz.test.ts
│   │       └── modules.test.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml         # Local development
├── .github/workflows/
│   └── deploy.yml             # Cloud Run CI/CD
└── README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: FRONTEND DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AESTHETIC DIRECTION: "Civic Modernism" — imagine if the Bauhaus movement designed 
a government service. Clean but bold. Democratic but dynamic. Authoritative but 
approachable. Not corporate. Not childish. Think: The Economist magazine layout 
meets Swiss grid design, with dark navy and warm amber as the soul.

COLOR PALETTE (CSS variables — apply globally):
  --color-navy: #0A1628         // Primary background
  --color-navy-mid: #152238     // Card backgrounds
  --color-navy-light: #1E3252   // Elevated surfaces
  --color-amber: #F59E0B        // Primary accent (CTAs, highlights)
  --color-amber-glow: #FCD34D   // Hover states
  --color-white: #F8FAFF        // Primary text
  --color-white-dim: #94A3B8    // Secondary text
  --color-green: #10B981        // Success, correct answers
  --color-red: #EF4444          // Error, wrong answers
  --color-border: #1E3252       // Borders
  --color-surface: #0D1F35      // Input surfaces

TYPOGRAPHY:
  Display font: "Playfair Display" (Google Fonts) — for headlines, hero text
  Body font: "IBM Plex Sans" (Google Fonts) — for body copy, UI
  Mono font: "JetBrains Mono" — for data, codes, timestamps
  
  Type scale (use rem throughout):
    --text-xs: 0.75rem
    --text-sm: 0.875rem
    --text-base: 1rem
    --text-lg: 1.125rem
    --text-xl: 1.25rem
    --text-2xl: 1.5rem
    --text-3xl: 1.875rem
    --text-4xl: 2.25rem
    --text-5xl: 3rem
    --text-6xl: 3.75rem

SPACING SYSTEM (8px base grid):
  --space-1: 0.25rem  (4px)
  --space-2: 0.5rem   (8px)
  --space-3: 0.75rem  (12px)
  --space-4: 1rem     (16px)
  --space-6: 1.5rem   (24px)
  --space-8: 2rem     (32px)
  --space-12: 3rem    (48px)
  --space-16: 4rem    (64px)
  --space-24: 6rem    (96px)

ANIMATION TOKENS (from Motion library — reference cloned repo patterns):
  --duration-fast: 150ms
  --duration-base: 250ms
  --duration-slow: 400ms
  --duration-slower: 600ms
  --ease-in: cubic-bezier(0.4, 0, 1, 1)
  --ease-out: cubic-bezier(0, 0, 0.2, 1)
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: PAGE-BY-PAGE IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### PAGE 1: LANDING PAGE (app/page.tsx)

Build a visually stunning landing page with these sections:

HERO SECTION:
- Full viewport height
- Background: Deep navy with subtle animated particle field (small white dots 
  slowly drifting — pure CSS, no libraries)
- A large ballot/voting box SVG illustration (amber colored, on the right side)
- Left side: 
    Headline: "Understand Elections." (Playfair Display, 72px, white)
    Subhead: "From registration to results — your complete civic education guide." 
    (IBM Plex Sans, 20px, white-dim)
- Two CTAs:
    Primary: "Start Learning →" (amber background, navy text, pill shape)
    Secondary: "Ask a Question" (outlined amber, white text)
- Animated entrance: staggered fade-up with 80ms delays between each element
- Scroll indicator: animated chevron pointing down

FEATURES SECTION:
- 3-column grid
- Cards with icon + title + description:
    🗳️ "Step-by-Step Guidance" — Walk through every stage of the election process
    🌍 "Any Country, Any Election" — Localized for 50+ countries and regions
    🎯 "Learn by Doing" — Interactive quizzes after every module
- Card hover: subtle lift (translateY -4px) + amber left border appears
- Background: navy-mid

HOW IT WORKS:
- Horizontal stepper with 4 numbered steps:
    1. Choose your country & knowledge level
    2. Pick a learning path or ask a question
    3. Complete modules with AI-powered explanations
    4. Test your knowledge with quizzes
- Steps connected by animated dashed lines
- Each step card: amber number badge, title, description
- On scroll: steps animate in left-to-right with 100ms stagger

GOOGLE SERVICES BADGE SECTION:
- "Powered by Google Services" label
- Small logo row: Gemini | Translate | Firebase | Maps | Cloud Run
- Subtle horizontal scroll on mobile

FOOTER:
- Logo + tagline
- Links: About, Privacy, Accessibility Statement
- "Non-partisan. AI-powered. Open-source."
- Dark navy background

### PAGE 2: ONBOARDING (app/onboard/page.tsx)

3-step wizard. Clean, focused. No distractions.

STEP 1 — Country Selection:
- Large title: "Where will you be voting?"
- Country flag grid (show 12 most common: US, UK, India, Canada, Australia, Germany, 
  France, Brazil, Japan, South Africa, Nigeria, Mexico)
- Search input above grid for all other countries
- Selected country: amber ring + scale(1.05) animation
- "Other / General" option for generic content

STEP 2 — Knowledge Level:
- Title: "How familiar are you with elections?"
- 3 large card options with icon + title + description:
    🌱 Beginner — "I'm new to all of this"
    📚 Intermediate — "I understand the basics"
    🎓 Expert — "I want deep dives and details"
- Card selection: amber background transition, 300ms ease

STEP 3 — Learning Goal:
- Title: "What brings you here today?"
- 3 goal cards:
    🗳️ "I want to register to vote" → routes to registration module first
    📖 "I want to understand the process" → routes to module 1
    👩‍🏫 "I'm teaching others about elections" → routes to educator view
- Progress bar at top (33% → 66% → 100% across steps)
- Back/Next navigation with keyboard support (arrow keys)
- Save selection to Zustand store + Firebase session

### PAGE 3: LEARNING HUB (app/learn/page.tsx)

LAYOUT: Two-panel layout
- Left sidebar (280px): Module list
- Right main area: Current module content

LEFT SIDEBAR:
- User progress summary at top (avatar-initial circle, "Your Progress", X/8 modules)
- Module list with:
    - Module number + title
    - Progress indicator (not started / in progress / completed)
    - Estimated time badge
    - Lock icon if module prerequisites not met
- Active module: amber left border + slight background highlight
- Collapse button for mobile

MAIN CONTENT AREA:
- Module header: number, category chip, estimated time, share button
- Content sections with rich formatting:
    - Section headers (Playfair Display, 28px)
    - Body text (IBM Plex Sans, 16px, 1.7 line height)
    - Key term callouts: amber left border, italic, slightly indented
    - Important notes: amber background panel
    - Step-by-step numbered lists with large amber numbers
    - Visual aids: inline SVG illustrations for concepts (e.g., ballot diagram, 
      timeline mini-preview)
- Reading progress: thin amber bar at top of viewport tracking scroll position
- "Ask ELECTRA" floating button (bottom-right corner):
    - Amber circle with chat icon
    - Click: slide-in AI chat panel from right (400px wide)
    - AI panel has conversation history + input + TTS toggle

COMPLETION BANNER:
- When module ends: full-width amber banner
- "Module Complete! Test your knowledge →" CTA to quiz

### PAGE 4: AI CHAT (app/chat/page.tsx)

Full-page conversational interface. This is the showstopper feature.

LAYOUT:
- Top header: "ELECTRA" logo + country flag + language selector + settings icon
- Left: conversation thread (full height, scrollable)
- Right panel (320px, collapsible): 
    - "Quick Topics" — 8 clickable suggestion chips
    - "Your Session" — module context, country, level
    - "Sources" — citations for last AI response

CONVERSATION THREAD:
- User bubbles: right-aligned, dark navy-light background, white text
- AI bubbles: left-aligned, gradient border (amber→transparent), dark navy-mid bg
    - AI name + small logo before each response
    - Markdown rendering: bold, italic, numbered lists, code blocks
    - Citations at bottom of each AI message (numbered superscripts)
    - TTS button (speaker icon) per message — calls /api/tts, plays audio inline
    - Copy button per message
    - Thumbs up/down feedback buttons (store in Firestore)
- Streaming: AI response streams token by token (SSE) with blinking cursor
- Typing indicator: 3 animated dots while waiting for first token

INPUT AREA (bottom, sticky):
- Multi-line textarea (auto-expands up to 4 lines)
- Left: language selector flag dropdown (Google Translate integration)
- Right: microphone icon (Web Speech API for voice input) + send button
- Send on Enter (Shift+Enter for newline)
- Character counter (max 500 chars)

SUGGESTED QUESTIONS CHIPS (above input when thread is empty):
  "How do I register to vote?"
  "What is the Electoral College?"
  "How are votes counted?"
  "What is a primary election?"
  "What ID do I need to vote?"
  "How does ranked-choice voting work?"
  "When is Election Day?"
  "What if I miss the registration deadline?"

LANGUAGE SELECTOR:
- 20 languages via Google Translate API
- When user changes language: translate entire last AI response
- Language persists to session in Firestore
- Flag icons + language name in dropdown

### PAGE 5: TIMELINE VISUALIZER (app/timeline/page.tsx)

Interactive horizontal timeline. This is the "wow" feature.

CONTROLS (top):
- Country dropdown (defaults to user's onboarded country)
- Election type selector (tabs): Presidential | Congressional | State/Local | Primary | Referendum
- Year input (current year default)

TIMELINE VISUALIZATION:
- Horizontal scrollable timeline (full viewport width)
- Time axis at bottom with months
- Events as vertical markers with:
    - Dot on timeline (amber = completed, white = upcoming, gray = optional)
    - Vertical line up to card
    - Card above/below alternating:
        - Event title (bold)
        - Date range
        - Short description
        - Status badge
- Categories color-coded:
    🟡 Amber: Voter Registration events
    🔵 Blue: Campaigning events  
    🟢 Green: Election Day events
    ⚪ White: Certification events
- Legend at top
- Hover on card: tooltip with detailed description + links
- Click on card: expand to full panel with AI-generated explanation (calls /api/chat 
  with timeline event context)
- Animate in on load: events slide up with stagger from left to right

TIMELINE DATA:
- Pre-built JSON for US Presidential, US Congressional, UK General, Indian General, 
  Canadian Federal, Australian Federal elections
- For other countries: call Gemini API to generate timeline events dynamically, 
  then cache in Firestore

### PAGE 6: QUIZ ENGINE (app/quiz/page.tsx)

After each module, a 5-question quiz. Gamified.

QUIZ FLOW:
1. Intro screen: module title + "5 questions · ~2 minutes" + "Begin Quiz" CTA
2. Question screen (one at a time):
   - Question number indicator (Q1/5, Q2/5...)
   - Progress bar filling left to right
   - Large question text (Playfair Display, 24px)
   - 4 answer options as large cards
   - Timer bar (30 seconds per question, amber → red as time runs out)
3. Answer reveal (immediate on selection):
   - Correct: green flash + checkmark animation + confetti burst
   - Wrong: red flash + X + correct answer highlighted green
   - Explanation text slides in below
4. Results screen:
   - Score circle animation (SVG arc drawing from 0 to X%)
   - Score: X/5 correct
   - Performance label: "Election Expert!" / "Good Effort!" / "Keep Studying!"
   - Review wrong answers (accordion)
   - Two CTAs: "Next Module →" | "Try Again"
   - Share score button (generates shareable image via Canvas API)

QUESTION TYPES:
- Multiple choice (4 options)
- True/False
- Timeline ordering drag-and-drop (e.g., "Order these election steps correctly")
- Fill-in-the-blank (term from glossary)

LEADERBOARD (optional bonus):
- Anonymous top scores from Firestore
- Filter by country
- "Your best score" highlighted

### PAGE 7: GLOSSARY (app/glossary/page.tsx)

150+ election terms, searchable and AI-enhanced.

LAYOUT:
- Search bar (prominent, top, with magnifier icon)
- Filter tabs: All | Registration | Voting | Counting | Systems | International
- A-Z alphabet index (horizontal scroll)
- Term cards:
    - Term name (bold, large)
    - Short definition (2-3 sentences)
    - "Explain like I'm 5" toggle button (calls AI for simpler explanation)
    - "Hear it" button (TTS)
    - Related terms chips
- Infinite scroll (20 terms per page)

SEARCH:
- Real-time client-side filtering
- Fuzzy search (using fuse.js)
- Highlight matched substring in results
- "Did you mean X?" for near misses

SEED DATA (glossary.json — 30 essential terms minimum to include):
Absentee Ballot, Ballot Measure, Caucus, Certify, Constituency, Delegate,
Disenfranchisement, Electoral College, Electoral Roll, Exit Poll, First Past The Post,
Gerrymandering, Initiative, Mail-In Voting, Midterm Election, Partisan, Polling Station,
Precinct, Primary Election, Proportional Representation, Provisional Ballot, Recount,
Redistricting, Referendum, Runoff Election, Swing State, Ticket Splitting, Turnout,
Voter ID, Write-In Candidate, ... (expand to 150 total)

### PAGE 8: POLLING LOCATOR (app/polling/page.tsx)

- Postal/zip code input with country prefix
- "Find Polling Places" button
- Google Maps embed below (800px height on desktop, 400px mobile)
- Results list beside/below map:
    - Location name + address
    - Distance from entered address
    - Opening hours
    - Accessibility info (wheelchair, audio ballot)
    - Directions link (opens Google Maps)
- Disclaimer: "Data sourced from official election authorities. Verify with your 
  local election office before Election Day."
- On mobile: map takes full width, results below

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: BACKEND IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 4.1 Express App Setup (backend/src/index.ts)

Initialize Express with:
- helmet() for security headers
- cors({ origin: [process.env.FRONTEND_URL], credentials: true })
- express-rate-limit: 60 requests per 15 minutes per IP
- body-parser with 10kb limit
- morgan for request logging
- Graceful shutdown on SIGTERM

### 4.2 Gemini Service (backend/src/services/gemini.ts)

Use @google-cloud/vertexai package.
Model: gemini-2.0-flash-001

```typescript
import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.VERTEX_AI_LOCATION || 'us-central1',
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.0-flash-001',
  generationConfig: {
    maxOutputTokens: 1024,
    temperature: 0.3,        // Low temp for factual accuracy
    topP: 0.8,
    topK: 40,
  },
  safetySettings: [
    { category: 'HARM_CATEGORY_POLITICALLY_SENSITIVE', threshold: 'BLOCK_ONLY_HIGH' },
    // All standard safety settings at BLOCK_MEDIUM_AND_ABOVE
  ],
});

// Build system instruction
const buildSystemInstruction = (context: ChatContext): string => `
You are ELECTRA, an expert, friendly, and strictly non-partisan election education assistant.
[Full system prompt as defined in PRD Section 1.8]
Country: ${context.country}
Knowledge Level: ${context.knowledgeLevel}
Current Module: ${context.currentModule || 'General'}
`;

// Streaming chat function
export async function streamChat(
  messages: Message[],
  context: ChatContext,
  onToken: (token: string) => void
): Promise<void> {
  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: sanitizeInput(m.content) }]
    })),
    systemInstruction: buildSystemInstruction(context),
  });
  
  const stream = await chat.sendMessageStream(
    sanitizeInput(messages[messages.length - 1].content)
  );
  
  for await (const chunk of stream) {
    const token = chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (token) onToken(token);
  }
}
```

### 4.3 Chat Route (backend/src/routes/chat.ts)

```typescript
router.post('/chat', authMiddleware, rateLimitMiddleware, async (req, res) => {
  const { messages, sessionId, language, moduleContext } = req.body;
  
  // Validate inputs
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }
  
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  
  // Fetch session context from Firestore
  const session = await firestoreService.getSession(sessionId);
  
  const context: ChatContext = {
    country: session?.country || 'General',
    knowledgeLevel: session?.knowledgeLevel || 'beginner',
    currentModule: moduleContext || 'General',
  };
  
  let fullResponse = '';
  
  try {
    await geminiService.streamChat(messages, context, (token) => {
      fullResponse += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    });
    
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    
    // Save conversation to Firestore (async, non-blocking)
    firestoreService.saveMessage(sessionId, {
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
      moduleContext,
    }).catch(console.error);
    
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: 'AI response failed' })}\n\n`);
    res.end();
  }
});
```

### 4.4 Google Translate Service

```typescript
import { TranslationServiceClient } from '@google-cloud/translate';

const translationClient = new TranslationServiceClient();

export async function translateText(
  text: string, 
  targetLanguage: string
): Promise<string> {
  const [response] = await translationClient.translateText({
    parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/locations/global`,
    contents: [text],
    targetLanguageCode: targetLanguage,
    mimeType: 'text/plain',
  });
  
  return response.translations?.[0]?.translatedText || text;
}
```

### 4.5 Google Text-to-Speech Service

```typescript
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const ttsClient = new TextToSpeechClient();

export async function synthesizeSpeech(
  text: string,
  languageCode: string = 'en-US'
): Promise<string> {
  // Strip markdown before TTS
  const cleanText = text.replace(/[*_#`]/g, '').substring(0, 5000);
  
  const [response] = await ttsClient.synthesizeSpeech({
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
