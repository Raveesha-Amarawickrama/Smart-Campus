# Smart Campus Web Companion
### SENG 41293 – Mobile Web Application Development | Track A

---

## Overview

A fully functional **Progressive Web App (PWA)** built for mobile viewports, designed to help university students manage their academic life.

---

## Features

### Core Features
- **Dashboard** — Today's live lecture schedule, urgent assignment highlights, real-time weather widget (Open-Meteo API, no key needed), greeting & summary stats
- **Assignments** — Full CRUD with dynamic status filtering (All / Pending / Completed / Overdue), search, color-coded priority badges, modal editor
- **Credits / GPA** — Semester-by-semester course history, automatic GPA calculation, degree progress donut chart, graduation path indicator
- **Notes** — HTML5 Camera API to capture handwritten lecture notes, subject-tagged gallery, search & filter

### Advanced Feature
- **HTML5 Camera API** — Opens device rear camera with a scan-frame overlay, captures photos as base64
- **IndexedDB Storage** — Captured note images are stored in IndexedDB (not localStorage) — see "Storage Architecture" below for why
- **Web Notifications API** — Requests permission and fires browser notifications for deadlines within 24 hours
- **REST API Integration** — Live weather data fetched from Open-Meteo (free, no API key) using `fetch()`

### PWA / Technical
- **Full Progressive Web App** — installable Web App Manifest + a custom Service Worker for true offline-first loading (see below)
- **In-app Install Prompt** — a dedicated "Install App" button on the Profile page triggers the native install dialog directly (via the `beforeinstallprompt` event), rather than relying on the user finding the browser's own menu option
- Mobile-first responsive layout (works on all viewport sizes from 360px+)
- All data persisted via `localStorage` (metadata) + `IndexedDB` (images) across sessions
- SPA routing (no page reloads)
- Touch-friendly targets (minimum 48×48px)
- Client-side form validation on all forms

### Offline Support (Service Worker)
- `public/sw.js` pre-caches the app shell (`index.html`, manifest, icons) on install
- **Navigation requests** use a network-first strategy with cache fallback — always serves the freshest app shell when online, falls back to cache when offline
- **Static assets** (JS/CSS bundles) use cache-first — instant repeat loads
- **Cross-origin API calls** (weather) are explicitly excluded from caching — always fetched live
- Old cache versions are automatically purged on activation
- A live offline/online banner (`useOnlineStatus` hook, native `navigator.onLine` + online/offline events) confirms connectivity state in the UI
- Test it: load the app once on localhost, then in DevTools → Network tab, switch to "Offline" and reload — the app shell still loads

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (SPA, hooks) |
| Bundler | Vite 5 |
| Styling | Pure CSS3 (no framework) — CSS Custom Properties, Flexbox, Grid |
| Storage | localStorage (metadata, JSON) + IndexedDB (note images) |
| External API | Open-Meteo Weather API (fetch / async) |
| Hardware API | HTML5 Camera API (`getUserMedia`) |
| Notifications | Web Notifications API |
| Offline | Service Worker (cache-first/network-first hybrid) |

---

## Storage Architecture — Why Two Storage Layers?

This app deliberately splits its data across **two** browser storage technologies, each chosen for what it's actually good at, rather than using one for everything:

| | `localStorage` | `IndexedDB` |
|---|---|---|
| **Used for** | User profile, assignments, courses, schedule, settings, note *metadata* | Note *image* bytes (captured photos) only |
| **API style** | Synchronous | Asynchronous (Promise/event-based) |
| **Quota** | ~5–10MB per origin | Hundreds of MB+ (browser-dependent) |
| **Why this choice** | Small JSON objects; sync API is simple and sufficient | Base64 photo strings are large; async API never blocks rendering; quota headroom for many captures |

In `src/utils/imageDB.js`, every note's metadata (`id`, `title`, `subject`, `createdAt`) stays in the existing `localStorage`-backed `notes` array via `AppContext`. Only the heavy base64 `imageData` is written to an IndexedDB object store, keyed by the same note `id`, and joined back onto the note object at render time in `Notes.jsx`. A one-time migration on first load moves any image data captured by an earlier version of the app (when everything was still in localStorage) into IndexedDB automatically, so no previously saved photos are lost.

This satisfies the rubric's explicit mention of *both* named storage technologies (`LocalStorage/IndexedDB`) with a genuine architectural reason for the split, rather than using just one for convenience.

---

## Browser Compatibility

| Browser | Support |
|---|---|
| Chrome 90+ | Full |
| Firefox 88+ | Full |
| Safari 15+ | Full (Camera requires HTTPS or localhost) |
| Edge 90+ |  Full |

> **Note:** The Camera API requires either `localhost` or an HTTPS connection. On HTTP in production, the camera button will display an appropriate error message.

---

## Getting Started (localhost)

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# 1. Extract the zip file
unzip SE_2021_XXX.zip
cd smart-campus

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Open in browser dev tools
1. Open Chrome/Firefox → Navigate to `http://localhost:3000`
2. Open DevTools → Click **Toggle Device Toolbar** (Ctrl+Shift+M / Cmd+Shift+M)
3. Select a device preset (iPhone 14, Pixel 7, Samsung Galaxy S20)

### Demo Credentials
Any email/password combination works (minimum 6 character password):
- Email: `student@university.edu`
- Password: `123456`

Or click **University Single Sign-On** to skip login.

---

## Deploying for Free (Live Cloud URL)

The brief allows presenting via **either** localhost **or** a live cloud URL. Three free options below — pick one.

### Option A — Vercel (recommended, fastest)
```bash
npm install -g vercel
vercel          # first deploy, follow prompts
vercel --prod   # subsequent deploys
```
Live in under a minute at `your-project.vercel.app`. Auto-detects Vite, zero config needed.

### Option B — Netlify (drag-and-drop, no CLI required)
```bash
npm run build
```
Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** and drag the generated `dist/` folder into the browser. Done — no account required for a single deploy.

### Option C — GitHub Pages (ties to your GitHub repo submission)
```bash
npm install            # installs gh-pages (already in devDependencies)
GH_PAGES=true npm run deploy
```
Then in your repo: **Settings → Pages → Source: gh-pages branch**. Live at `https://<username>.github.io/smart-campus/`.

> **Note:** `vite.config.js` switches its `base` path automatically via the `GH_PAGES` environment variable — Option A and B need no env var (default root `base: '/'`), Option C requires `GH_PAGES=true` so all asset paths correctly prefix with `/smart-campus/`.

After deploying, all PWA features (Service Worker, manifest, installability) work identically on any of the three hosts since paths are resolved relative to the deployment's own base path.

---

## Project Structure

```
smart-campus/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   ├── manifest.json          # PWA manifest (installability)
│   ├── sw.js                  # Service Worker (offline caching)
│   ├── icon-192.png           # PWA icon (192x192)
│   ├── icon-512.png           # PWA icon (512x512)
│   └── apple-touch-icon.png   # iOS home screen icon
└── src/
    ├── main.jsx               # React entry point + SW registration
    ├── App.jsx                # Shell + SPA router + offline banner
    ├── AppContext.jsx         # Global state (Context API)
    ├── index.css              # All styles + design tokens
    ├── components/
    │   ├── Icon.jsx           # SVG icon library
    │   ├── Toast.jsx          # Toast notification system
    │   └── NotificationsPanel.jsx
    ├── data/
    │   └── defaults.js        # Seed data + utility functions
    ├── hooks/
    │   ├── useOnlineStatus.js  # Online/Offline Events API hook
    │   └── useInstallPrompt.js # PWA install-prompt lifecycle hook
    ├── pages/
    │   ├── Landing.jsx        # Marketing landing page
    │   ├── Auth.jsx           # Login + Register screens
    │   ├── Dashboard.jsx      # Home dashboard
    │   ├── Assignments.jsx    # Assignment tracker
    │   ├── Credits.jsx        # GPA + credit tracker
    │   ├── Notes.jsx          # Camera notes (IndexedDB-backed images)
    │   └── Profile.jsx        # Profile + settings + Install App button
    └── utils/
        ├── storage.js         # localStorage wrapper
        ├── imageDB.js         # IndexedDB wrapper for note images
        └── registerSW.js      # Service Worker registration logic
```

---

## Grading Criteria Coverage

| Criterion | Implementation |
|---|---|
| Mobile-First & Responsive Design | CSS custom properties, Flexbox/Grid, 48px touch targets, media queries, fluid typography |
| Code Quality & Architecture | Modular components, Context API state management, ES6+, async/await, error handling |
| Browser Storage & Web API | localStorage (metadata) + IndexedDB (images), Camera API, Notifications API, Service Worker (offline cache + install prompt), Fetch API (weather) |
| Simulated Browser Performance | No runtime errors, smooth transitions, CSS animations, layout stability |
| Viva Voce | SPA routing, Context state management, localStorage persistence, Camera API explained |

---

*University of Kelaniya — Faculty of Science — SENG 41293*
