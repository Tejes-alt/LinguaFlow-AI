# LinguaFlow AI 🌐

A premium, production-quality AI translator built with React, Vite, and Tailwind CSS — with a searchable translation history, a live stats dashboard, voice input/output, and a built-in random string / password / UUID generator.

## Overview

LinguaFlow AI translates text across 29 languages with automatic language detection, keeps every translation in a searchable local history, and turns your usage into a small live dashboard. It also ships a second, unrelated-but-handy tool: a customizable random string, password, and UUID generator. Everything is wrapped in a glassmorphic, animated UI with full dark mode support.

## Features

**Translator**
- Text translation via the Microsoft Translator Text API (RapidAPI), with automatic language detection and a detection-confidence badge
- Copy, clear, swap languages (with text swap), download as `.txt`, and share (native share sheet with clipboard fallback)
- Speak-to-type dictation and read-aloud playback via the browser's built-in speech APIs
- Paste from clipboard, or drag-and-drop / upload a `.txt` file
- Character counter, live word count, 5,000-character limit
- Recent and favorite target languages as one-tap chips
- Keyboard shortcuts: `Ctrl/Cmd + Enter` to translate, `Esc` to clear, `Ctrl/Cmd + C` to copy the result (only when no text elsewhere on the page is selected, so it never fights normal copy/paste)
- Skeleton loading state, inline error handling for missing keys, invalid keys, rate limits, and network failures
- A confetti burst on every successful translation

**Random String Generator**
- Custom strings (adjustable length, uppercase/lowercase/numbers/symbols), strong passwords, and RFC 4122 v4 UUIDs
- Live strength meter, save-to-list with copy/delete, all persisted locally

**History & Dashboard**
- Every translation saved to `localStorage`, with instant debounced search, a favorites filter, one-click "reuse" back into the translator, and per-item delete
- Export history as CSV or as a formatted PDF
- Home page dashboard: total translations, characters translated, translations today, most-used language, and a language-distribution chart (Recharts)

**Everywhere else**
- Light/dark mode with persistence and system-preference detection
- Animated route transitions, an animated mobile nav, toast notifications, and a signature animated "greeting wave" on the homepage
- Fully responsive, keyboard-navigable, with visible focus states and `prefers-reduced-motion` support
- Route-based code splitting (`React.lazy`/`Suspense`) so each page ships as its own chunk

## Screenshots

_Run the app locally (see below) and drop your own screenshots here before publishing — none are bundled with this build._

## Tech Stack

React 18 · Vite 5 · Tailwind CSS 3 · React Router 6 · Axios · Framer Motion 11 · React Icons · Recharts 2 · jsPDF 2 · clsx

## Getting Started

### Prerequisites
- Node.js 18 or newer

### Installation
```bash
cd linguaflow-ai
npm install
```

### Environment Variables & RapidAPI Setup
Copy the example file:
```bash
cp .env.example .env
```

Then get a free key:
1. Create an account at [rapidapi.com](https://rapidapi.com).
2. Subscribe to the **Microsoft Translator Text** API (it has a free tier).
3. Copy your key from the API's "Endpoints" tab (the `X-RapidAPI-Key` value).
4. Paste it into `.env`:

```
VITE_RAPIDAPI_KEY=your_key_here
VITE_RAPIDAPI_HOST=microsoft-translator-text.p.rapidapi.com
```

Without a key, every other feature (generator, history, dashboard, theming) still works — only the actual translate call will show a clear inline error telling you to add one.

**Using a different translation provider?** `src/services/rapidApi.js` is the only file that talks to the API. Update the request body/params and the response-mapping in `translateText()` to match your provider's shape; nothing else in the app needs to change.

### Running Locally
```bash
npm run dev
```
Visit `http://localhost:5173`.

### Building for Production
```bash
npm run build
npm run preview
```

## Folder Structure
```
linguaflow-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/       # Reusable UI: Navbar, TranslatorCard, RandomGenerator, HistoryCard, etc.
│   ├── pages/             # Home, Translator, Generator, History, About, Error404
│   ├── context/           # ThemeContext, ToastContext, HistoryContext
│   ├── hooks/              # useLocalStorage, useDebounce, useKeyboardShortcut, useSpeech
│   ├── services/          # rapidApi.js — the translation API layer
│   ├── utils/               # languages, textStats, generator, exportUtils
│   ├── styles/             # index.css (Tailwind + custom design tokens)
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Available Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Type-check-free production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## A note on dependency versions

This project intentionally pins **React 18, React Router 6, Framer Motion 11, Recharts 2, and Tailwind CSS 3** rather than the newest majors available at build time (React 19, Router 7, Tailwind 4, Recharts 3, jsPDF 4 were all out), because this combination is a well-established, mutually compatible generation of these libraries. `npm audit` will flag two transitive vulnerabilities as a result:
- **dompurify** (via jsPDF's optional HTML-rendering feature) — this app never calls that code path (only plain-text PDF export via `doc.text()`), so it isn't reachable here.
- **esbuild** (via Vite's dev server) — a long-standing, dev-server-only issue that doesn't affect production builds.

You can run `npm audit fix --force` if you'd like the latest majors, but be aware it will require adapting `src/services/rapidApi.js`-adjacent code to Vite 8/Tailwind 4/etc. syntax changes.

## Future Improvements
- OCR image translation (upload a photo, extract and translate the text)
- True keyboard arrow-navigation everywhere (currently implemented in the language picker; could extend app-wide)
- PWA / offline support
- Cloud sync across devices (currently everything is local-only by design, for privacy)
- Additional languages beyond the current 29
- Component and end-to-end test coverage (none is included in this build)

## Author
Built by **[Your Name]** — feel free to fork, customize, and make it your own.

## License
MIT — see [LICENSE](./LICENSE).
