# ELECTRA — AI Election Education Platform

> An AI-powered civic education platform that helps citizens worldwide understand elections, voter registration, and democratic processes. Built for the Google Antigravity Hackathon.

---

## Architecture

```
ELECTRA/
├── backend/           Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── routes/    chat, modules, quiz, timeline, glossary, polling, translate, tts
│   │   ├── services/  Gemini AI, Firestore, Google Translate, TTS, Maps
│   │   ├── middleware/ auth, rate-limit, sanitize, security
│   │   └── data/      modules.json, glossary.json, timelines.json
│   └── Dockerfile
├── frontend/          Next.js 14 + TypeScript + Zustand
│   ├── app/           Pages: dashboard, chat, learn, quiz, timeline, glossary, polling, onboard
│   ├── components/    Layout shell (Sidebar, Header, ClientLayout)
│   ├── lib/           API client, Zustand stores, types
│   └── skill repos/   stitch-skills, motion, ui-ux-pro-max-skill, impeccable
└── Dockerfile         Multi-stage production build
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI** | Google Vertex AI (Gemini 2.0 Flash) — streaming SSE |
| **Backend** | Node.js, Express, TypeScript |
| **Frontend** | Next.js 14, React 19, Zustand, Vanilla CSS |
| **Database** | Firebase Firestore |
| **Translation** | Google Cloud Translation API |
| **Voice** | Google Cloud Text-to-Speech (Neural2) |
| **Maps** | Google Maps Platform (Geocoding + Places) |
| **Security** | Helmet, CORS, Rate Limiting, Input Sanitization |

## Design System

**Civic Modernism** — dark theme with warm navy tints and a single decisive amber accent.

Informed by four cloned skill repositories:
- **Impeccable** — Editorial design laws: flat-at-rest surfaces, expo-out easing, no gradient text, no identical card grids, `prefers-reduced-motion` respected
- **UI-UX-Pro-Max** — Pre-delivery checklist: SVG icons (no emojis), cursor-pointer, hover states, focus rings, WCAG 4.5:1 contrast, responsive breakpoints
- **Stitch Skills** — Component scaffolding patterns
- **Motion** — Animation principles (transform + opacity only)

## Features

- **AI Chat Assistant** — Ask anything about elections with real-time SSE streaming from Gemini
- **Learning Modules** — 8 structured modules with progressive content
- **Interactive Quizzes** — Per-module quizzes with scoring, feedback, and leaderboards
- **Election Timeline** — Country-specific key dates and milestones
- **Polling Locator** — Google Maps integration for finding voting stations
- **Civic Glossary** — 40+ election terms with search and alphabetical grouping
- **Multilingual** — 20 languages via Google Cloud Translation
- **Text-to-Speech** — Neural2 voice synthesis for accessibility
- **Onboarding** — 3-step personalization (country, level, goal)

## Getting Started

### Prerequisites

- Node.js 20+
- Google Cloud project with enabled APIs:
  - Vertex AI
  - Firestore
  - Cloud Translation
  - Cloud Text-to-Speech
  - Maps JavaScript + Places + Geocoding

### Backend

```bash
cd backend
cp .env.example .env     # Fill in your GCP credentials
npm install
npm run dev              # Starts on :8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # Starts on :3000
```

### Environment Variables

```env
# backend/.env
PORT=8080
NODE_ENV=development
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GOOGLE_MAPS_API_KEY=your-maps-key
FRONTEND_URL=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Docker

```bash
docker build -t electra .
docker run -p 8080:8080 -p 3000:3000 --env-file backend/.env electra
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/chat` | SSE streaming chat with Gemini |
| GET | `/api/modules` | List learning modules |
| GET | `/api/modules/:id` | Get specific module |
| GET | `/api/quiz/:moduleId` | Get quiz questions |
| POST | `/api/quiz/submit` | Submit quiz answers |
| GET | `/api/timeline/:country` | Country election timeline |
| GET | `/api/glossary` | Search glossary terms |
| POST | `/api/translate` | Translate text |
| POST | `/api/tts` | Text-to-speech synthesis |
| GET | `/api/polling?address=...` | Find polling locations |
| GET | `/health` | Health check |

## Security

- **Helmet** — HTTP security headers (CSP, HSTS, etc.)
- **CORS** — Strict origin allowlist
- **Rate Limiting** — Global (100/15min), Chat (20/min), TTS (10/min)
- **Input Sanitization** — XSS prevention, prompt injection protection
- **Firebase Auth** — Session-based authentication middleware

## License

Built for the Google Antigravity Hackathon 2026.
