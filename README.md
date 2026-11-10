# TidySpace AI 🧹✨
### AI-Powered Room Decluttering & Spatial Organization Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-teal.svg)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini-3.8--Flash-orange.svg)](https://ai.google.dev/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](LICENSE)

**TidySpace AI** transforms photos of messy rooms into structured, empathetic, and actionable decluttering roadmaps. By inspecting room geometry and spatial composition with Google's **Gemini 3.8 Flash**, it pinpoints clutter hotspots with interactive visual overlays, catalogs items into a **3-Pile Sorting Guide (Keep, Donate, Discard)**, delivers a chronological **Action Plan with a 15-Minute Sprint Timer**, and suggests **Tailored Storage Systems** with zero-cost DIY alternatives.

---

## 🌟 Key Features

### 1. Multimodal Spatial Room Analysis
- **Live Camera or File Upload**: Upload photos of any room (living room, bedroom, home office, walk-in closet, kitchen counter, garage, playroom).
- **Realistic Sample Presets**: Includes 4 high-resolution sample rooms (*Work Desk & Cable Nest*, *Family Living Room*, *Walk-in Wardrobe*, *Kitchen Countertops*) for instant one-click testing.
- **Interactive Hotspot Overlays**: Visual bounding boxes map out clutter clusters (cables, paper piles, overflowing shelves, floor bottlenecks) with severity rankings, root causes, and targeted remedies.
- **Zoned Spatial Blueprint**: Toggle between the original inspected photo and an architectural clean-layout vision.

### 2. The 3-Pile Sorting Station
- **Keep**: Flags essential items and designates exact homes for each.
- **Donate**: Identifies usable items and pairs them with community channels (libraries, shelters, donation centers).
- **Discard & Recycle**: Details eco-conscious disposal tips for electronics, textiles, and paper.
- **Interactive Checklists & Item Search**: Live counters (`tabular-nums`), item search, and ability to add custom items found on the fly.

### 3. Step-by-Step Action Plan & 15-Minute Sprint Timer
- **5-Minute Quick Wins**: Micro-tasks to generate immediate visual momentum.
- **Sequential Roadmap**: Chronological instructions with realistic time estimates to prevent shifting mess between areas.
- **Integrated Sprint Timer**: 15-minute countdown clock with celebration confetti upon milestone completion.

### 4. Storage Solutions & Zero-Cost DIY Hacks
- Containment recommendations (cable trays, drawer organizers, risers) paired with free household alternatives (*repurposing cut shoe boxes, binder clips for cable routing*).

### 5. Floating "Ask Organizer AI" Assistant
- Real-time conversational coach grounded in the specific photo context to answer questions about sentimental items, tight budgets, or rental-friendly tips.

### 6. Full Progressive Web App (PWA)
- **1-Click Installation**: Installable as a standalone desktop or mobile application.
- **Offline Support**: Service worker caching and offline banners when network connectivity drops.
- **Persistent Storage**: Preserves multiple rooms and progress in local storage across browser reloads.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Canvas Confetti.
- **Backend / Proxy**: Express server (`server.ts`) with Vite dev middleware and `@google/genai` TypeScript SDK.
- **AI Model**: `gemini-3.8-flash` (multimodal vision + structured JSON output).
- **PWA Tooling**: `vite-plugin-pwa` with automatic service worker registration and web app manifest.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **npm**: `v10+`
- **Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone Repository
```bash
git clone https://github.com/your-username/tidyspace-ai.git
cd tidyspace-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and set your API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### 5. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 📦 Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI build & lint workflow
├── public/
│   ├── icon.svg                 # Vector brand icon
│   ├── favicon.ico              # Browser tab favicon
│   ├── apple-touch-icon.png     # iOS Safari home screen icon (180x180)
│   ├── pwa-192x192.png          # Android/Chromium icon (192x192)
│   ├── pwa-512x512.png          # High-resolution icon (512x512)
│   └── pwa-maskable-512x512.png # Maskable adaptive icon (512x512 with safe zone)
├── scripts/
│   └── generate-icons.js        # Script to render PWA PNG assets
├── src/
│   ├── assets/
│   │   └── images/              # High-resolution sample room images
│   ├── components/
│   │   ├── ActionPlanChecklist.tsx    # Chronological tasks + sprint timer
│   │   ├── Header.tsx                 # Top bar adhering to 3-zone contract
│   │   ├── InteractivePhotoViewer.tsx # Photo canvas with zone bounding boxes
│   │   ├── OfflineIndicator.tsx       # Offline status banner
│   │   ├── OrganizerChatDrawer.tsx    # AI organizer conversational drawer
│   │   ├── PWAInstallButton.tsx       # PWA in-app installation prompt
│   │   ├── RoomUploader.tsx           # Photo upload, sample picker, preferences
│   │   ├── SavedRoomsModal.tsx        # Multi-room history manager
│   │   ├── StorageGuide.tsx           # Storage items & zero-cost DIY hacks
│   │   └── TransformationBlueprint.tsx # Architectural principles & habits
│   ├── hooks/
│   │   ├── useOnlineStatus.ts         # Connectivity detection hook
│   │   └── usePWAInstall.ts           # PWA install prompt handler
│   ├── utils/
│   │   ├── imageUtils.ts              # File reading, resizing, base64 conversion
│   │   └── storage.ts                 # LocalStorage persistence manager
│   ├── types.ts                       # TypeScript interfaces & sample data
│   ├── App.tsx                        # Main application container
│   ├── main.tsx                       # Entry React DOM mount
│   └── index.css                      # Tailwind v4 configuration & theme
├── server.ts                          # Express server with Gemini API routes
├── Dockerfile                         # Production container definition
├── .dockerignore                      # Docker ignore rules
├── package.json                       # Scripts and dependencies
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite + Tailwind + VitePWA plugins
```

---

## 🌐 Deployment Instructions

### Option 1: Docker (Cloud Run, Railway, Render, Fly.io, or VPS)
Because TidySpace AI uses an Express server to proxy Gemini API calls securely:
1. Build the Docker container:
   ```bash
   docker build -t tidyspace-ai .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" tidyspace-ai
   ```

### Option 2: Render / Railway
1. Push this repository to GitHub.
2. In Render or Railway, create a **New Web Service** connected to your repository.
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment Variable**: `GEMINI_API_KEY` = your Gemini API key.
4. Deploy!

### Option 3: Google Cloud Run
1. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
2. Build and deploy directly from source:
   ```bash
   gcloud run deploy tidyspace-ai \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY="your_api_key"
   ```

### Option 4: Hosting on GitHub
To push this code to a new GitHub repository:
```bash
git init
git add .
git commit -m "feat: initial commit of TidySpace AI with PWA and Gemini vision"
git branch -M main
git remote add origin https://github.com/your-username/tidyspace-ai.git
git push -u origin main
```

---

## 📱 Progressive Web App (PWA) Installation

- **Google Chrome / Microsoft Edge / Brave (Desktop & Android)**:
  Click the **"Install App"** button located in the top navigation header or the browser install icon in the address bar.
- **Apple iOS Safari (iPhone / iPad)**:
  Tap the **Share** button in Safari's bottom toolbar, scroll down, and select **"Add to Home Screen"**.

---

## 📄 License

Licensed under the Apache License, Version 2.0.
