---
<div align="center">

<img src="https://img.shields.io/badge/%F0%9F%97%B3%EF%B8%8F-ELECTRA-FF4D1C?style=for-the-badge" alt="ELECTRA" />

# ELECTRA
### AI-Powered Election Education Assistant

*Your step-by-step guide to every vote that matters.*

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%F0%9F%8C%90%20Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://electra-frontend-378627599868.asia-south1.run.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-ELECTRA-181717?style=for-the-badge&logo=github)](https://github.com/Rituraj-Anos/ELECTRA)
[![Hackathon](https://img.shields.io/badge/Google%20Antigravity-Hackathon%202026-FF4D1C?style=for-the-badge&logo=google)](https://github.com/Rituraj-Anos/ELECTRA)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js%2020-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-4285F4?style=flat-square&logo=google-cloud&logoColor=white)
![Groq](https://img.shields.io/badge/Groq%20AI-F55036?style=flat-square&logo=groq&logoColor=white)

<br/>

[Features](#-features) · [Live Demo](#-live-demo) · [Architecture](#-architecture) · [Google Services](#-google-services) · [Quick Start](#-quick-start) · [Modules](#-learning-modules)

---

</div>

## 🎯 The Problem

Millions of first-time voters, students, and new citizens struggle to understand elections. Information is scattered across government websites, written in dense legalese, and rarely personalized.

| Pain Point | Impact |
|---|---|
| Information scattered across websites | Citizens stay uninformed |
| Complex legal language | First-time voters feel lost |
| No personalized guidance | High abstention rates |
| Language barriers | Immigrant communities excluded |
| No interactive learning | Low civic engagement |

**ELECTRA solves this** with a conversational AI tutor that explains every step of the election process — from registration to results — in plain language, with timelines, quizzes, and visual aids.

---

## ✨ Features

<table>
<tr>
<td>

**🤖 AI Chat Assistant**
Ask anything about elections. Powered by Groq LLaMA 3.3 70B, streaming token by token like ChatGPT.

</td>
<td>

**📚 8 Learning Modules**
Structured lessons from voter registration to ballot counting with rich content and callouts.

</td>
</tr>
<tr>
<td>

**🗺️ Election Timeline**
Interactive visual timeline for 6+ countries. See every milestone from campaign to certification.

</td>
<td>

**🧠 Quiz Engine**
5-question quizzes after each module with animated score circle and detailed feedback.

</td>
</tr>
<tr>
<td>

**📖 Election Glossary**
150+ searchable election terms with AI plain-English explanations and Text-to-Speech.

</td>
<td>

**📍 Polling Locator**
Find nearby voting stations via Google Maps for any address worldwide.

</td>
</tr>
<tr>
<td>

**🌍 20+ Languages**
Real-time translation powered by Google Translate API — making civic education borderless.

</td>
<td>

**♿ WCAG 2.1 AA**
Fully accessible — keyboard navigation, ARIA labels, screen reader support, TTS on every response.

</td>
</tr>
</table>

---

## 🌐 Live Demo

| | URL |
|---|---|
| 🌐 **Frontend** | https://electra-frontend-378627599868.asia-south1.run.app |
| 🔌 **Backend API** | https://electra-backend-378627599868.asia-south1.run.app |

### Try It Now
```
💬 Chat    → "How do I register to vote in India?"
📚 Learn   → Complete the "Voter Registration" module  
🗺️ Timeline → Select "India" + "General Election"
🧠 Quiz    → Score 5/5 → earn "Election Expert!"
📖 Glossary → Search "Electoral College"
📍 Polling  → Enter "Connaught Place, New Delhi"
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│          Frontend  (Next.js 16 + TypeScript)     │
│          Deployed on Google Cloud Run            │
│                                                  │
│  Landing · Onboard · Chat · Learn · Timeline     │
│  Quiz · Glossary · Polling                       │
└──────────────────────┬──────────────────────────┘
                       │  HTTPS + SSE Streaming
┌──────────────────────▼──────────────────────────┐
│          Backend  (Node.js + Express)            │
│          Deployed on Google Cloud Run            │
│                                                  │
│  /chat  /modules  /quiz  /timeline  /glossary    │
│  /translate  /tts  /polling                      │
└──┬──────────┬───────────┬────────────────────────┘
   │          │           │
   ▼          ▼           ▼
 Groq AI   Google      Firebase
 LLaMA 3  Services    Firestore
```

---

## ☁️ Google Services

| Service | Purpose |
|---|---|
| **Google Cloud Run** | Frontend + Backend containerized deployment |
| **Firebase Firestore** | Session persistence, quiz results, user progress |
| **Firebase Authentication** | Anonymous session management — no sign-up required |
| **Google Translate API** | Real-time multilingual content in 20+ languages |
| **Google Text-to-Speech API** | Audio accessibility for every AI response |
| **Google Maps Embed API** | Interactive polling location finder |
| **Google Analytics 4** | Usage tracking and feature analytics |
| **Google Cloud Build** | CI/CD pipeline — auto-deploy on every push to main |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ · npm 10+ · Google Cloud account · Groq API key

### Installation

```bash
# Clone
git clone https://github.com/Rituraj-Anos/ELECTRA.git
cd ELECTRA

# Backend
cd backend && npm install && cp .env.example .env
# → Fill in API keys in .env
npm run dev   # → http://localhost:8080

# Frontend (new terminal)
cd frontend && npm install && cp .env.example .env.local  
# → Fill in Firebase config
npm run dev   # → http://localhost:3000
```

### Environment Variables

<details>
<summary><b>backend/.env</b></summary>

```env
PORT=8080
NODE_ENV=development
GOOGLE_CLOUD_PROJECT=your-project-id
FIREBASE_PROJECT_ID=your-project-id
GROQ_API_KEY=your-groq-key
GOOGLE_TRANSLATE_API_KEY=your-key
GOOGLE_TTS_API_KEY=your-key
GOOGLE_MAPS_API_KEY=your-key
FRONTEND_URL=http://localhost:3000
```
</details>

<details>
<summary><b>frontend/.env.local</b></summary>

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
</details>

---

## 📚 Learning Modules

| # | Module | Topics | Time |
|---|---|---|---|
| 1 | 🗳️ Voter Registration | Eligibility, deadlines, how to register, ID requirements | 8 min |
| 2 | 🏛️ Types of Elections | Presidential, congressional, local, primary, referendum | 6 min |
| 3 | 📋 How Voting Works | Polling places, mail-in, early voting, ballot types | 10 min |
| 4 | ⚖️ Electoral Systems | First-past-the-post, proportional, ranked-choice | 12 min |
| 5 | 📅 Election Timeline | Campaign → Election Day → Counting → Certification | 8 min |
| 6 | 🔢 How Votes Are Counted | Hand count, machines, observers, recounts | 9 min |
| 7 | 🔒 Election Security | Safeguards, audits, chain of custody | 7 min |
| 8 | 🏁 After the Election | Transition of power, electoral college, certification | 8 min |

---

## 🌍 Supported Countries

🇺🇸 United States &nbsp; 🇮🇳 India &nbsp; 🇬🇧 United Kingdom &nbsp; 🇨🇦 Canada &nbsp; 🇦🇺 Australia &nbsp; 🇩🇪 Germany &nbsp; 🇫🇷 France &nbsp; 🇧🇷 Brazil &nbsp; 🇿🇦 South Africa &nbsp; 🇳🇬 Nigeria &nbsp; + 40 more

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm test

# Frontend type check  
cd frontend && npx tsc --noEmit

# Test coverage
npm run test:coverage
```

---

## 🔒 Security

- ✅ Firebase Anonymous Auth on all production API requests
- ✅ Rate limiting — 60 requests/minute per session
- ✅ Input sanitization against prompt injection attacks
- ✅ CORS restricted to frontend origin only
- ✅ Helmet.js security headers on all responses
- ✅ Zero PII collected — fully anonymous sessions
- ✅ All API keys in environment variables, never committed

---

## 🎨 Design

- **Typography:** Bricolage Grotesque (headings) + Inter (body)
- **Palette:** Warm cream `#FDF8F3` · Deep navy `#0B0E1A` · Orange-red `#E8380D`
- **Animations:** motion/react — staggered fade-ups, scroll-triggered, AnimatePresence
- **Inspiration:** Flexio Framer template

---

## 🏆 Hackathon

| | |
|---|---|
| **Event** | Google Antigravity Hackathon 2026 |
| **Challenge** | Challenge 2 — Election Process Education |
| **Participants** | 16,876 |
| **Builder** | Rituraj Mukhopadhyay |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for democratic education**

*Non-partisan · AI-powered · Accessible · Open-source*

[![Star on GitHub](https://img.shields.io/github/stars/Rituraj-Anos/ELECTRA?style=social)](https://github.com/Rituraj-Anos/ELECTRA)

</div>
