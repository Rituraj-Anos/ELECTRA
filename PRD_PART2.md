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
