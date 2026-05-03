# ELECTRA — AI Election Education Platform

> An AI-powered civic education platform that helps citizens worldwide understand elections, voter registration, and democratic processes. Built for the Google Antigravity Hackathon.

---

## 🏗️ Architecture

```text
ELECTRA/
├── backend/           Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── routes/    chat, modules, quiz, timeline, glossary, polling, translate, tts
│   │   ├── services/  Groq AI, Firestore, Google Translate, TTS, Maps
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

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI** | Groq API (llama-3.3-70b-versatile) — streaming SSE |
| **Backend** | Node.js, Express, TypeScript |
| **Frontend** | Next.js 14, React 19, Zustand, Vanilla CSS |
| **Database** | Firebase Firestore |
| **Translation** | Google Cloud Translation API |
| **Voice** | Google Cloud Text-to-Speech (Neural2) |
| **Maps** | Google Maps Platform (Geocoding + Places) |
| **Security** | Helmet, CORS, Rate Limiting, Input Sanitization |

---

## ✨ Features

- **AI Chat Assistant** — Ask anything about elections with real-time SSE streaming from Groq
- **Learning Modules** — 8 structured modules with progressive content
- **Interactive Quizzes** — Per-module quizzes with scoring, feedback, and leaderboards
- **Election Timeline** — Country-specific key dates and milestones
- **Polling Locator** — Google Maps integration for finding voting stations
- **Civic Glossary** — 40+ election terms with search and alphabetical grouping
- **Multilingual** — 20 languages via Google Cloud Translation
- **Text-to-Speech** — Neural2 voice synthesis for accessibility
- **Onboarding** — 3-step personalization (country, level, goal)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Groq API Key
- Google Cloud project with enabled APIs:
  - Firestore
  - Cloud Translation
  - Cloud Text-to-Speech
  - Maps JavaScript + Places + Geocoding

### Backend

```bash
cd backend
cp .env.example .env     # Fill in your credentials
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
GROQ_API_KEY=your-groq-api-key
FRONTEND_URL=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

### Docker

```bash
docker build -t electra .
docker run -p 8080:8080 -p 3000:3000 --env-file backend/.env electra
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/chat` | SSE streaming chat with Groq |
| GET | `/api/modules` | List learning modules |
| GET | `/api/modules/:id` | Get specific module |
| GET | `/api/quiz/:moduleId` | Get quiz questions |
| POST | `/api/quiz/:moduleId/submit` | Submit quiz answers |
| GET | `/api/timeline/:country` | Country election timeline |
| GET | `/api/glossary` | Search glossary terms |
| POST | `/api/translate` | Translate text |
| POST | `/api/tts` | Text-to-speech synthesis |
| GET | `/api/polling?address=...` | Find polling locations |
| GET | `/health` | Health check |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend type check
cd frontend
npx tsc --noEmit

# Run all tests with coverage
npm run test:coverage
```

---

## 🎨 Design System

- **Typography:** Bricolage Grotesque (headings) + Inter (body)
- **Colors:** Warm cream `#FDF8F3` · Deep navy `#0B0E1A` · Orange-red `#E8380D`
- **Inspiration:** Flexio Framer template (https://neat-train-378209.framer.app)
- **Animations:** motion/react — staggered fade-ups, scroll-triggered, AnimatePresence
- **Accessibility:** WCAG 2.1 AA · Keyboard navigation · ARIA labels · Screen reader support

---

## 📊 Learning Modules

| # | Module | Topics | Time |
|---|---|---|---|
| 1 | 🗳️ Voter Registration | Eligibility, deadlines, how to register | 8 min |
| 2 | 🏛️ Types of Elections | Presidential, local, primary, referendum | 6 min |
| 3 | 📋 How Voting Works | Polling places, mail-in, early voting | 10 min |
| 4 | ⚖️ Electoral Systems | FPTP, proportional, ranked-choice | 12 min |
| 5 | 📅 Election Timeline | Campaign → Election Day → Certification | 8 min |
| 6 | 🔢 How Votes Are Counted | Hand count, machines, recounts | 9 min |
| 7 | 🔒 Election Security | Safeguards, audits, chain of custody | 7 min |
| 8 | 🏁 After the Election | Transition of power, certification | 8 min |

---

## 🌍 Supported Countries

🇺🇸 United States · 🇮🇳 India · 🇬🇧 United Kingdom · 🇨🇦 Canada · 🇦🇺 Australia · 🇩🇪 Germany · 🇫🇷 France · 🇧🇷 Brazil · 🇿🇦 South Africa · 🇳🇬 Nigeria · + 40 more

---

## 🔒 Security

- ✅ Firebase Anonymous Authentication on all API requests
- ✅ Rate limiting: 60 requests/minute per session
- ✅ Input sanitization against prompt injection
- ✅ CORS restricted to frontend origin
- ✅ Helmet.js security headers
- ✅ No PII collected — anonymous sessions only
- ✅ API keys stored in environment variables (never committed)
- ✅ HTTPS enforced via Cloud Run

---

## 🏆 Hackathon Details

| | |
|---|---|
| **Event** | Google Antigravity Hackathon 2026 |
| **Challenge** | Challenge 2 — Election Process Education |
| **Target** | Top 100 of 16,876 participants |
| **Team** | Rituraj Mukhopadhyay |
| **Built With** | Google Cloud Run · Firebase · Groq AI · Next.js · Node.js |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for democratic education**

*Non-partisan · AI-powered · Accessible · Open-source*

[![GitHub](https://img.shields.io/badge/⭐%20Star%20on%20GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Rituraj-Anos/ELECTRA)

</div>
