# Heavens Gates Multiverse Web App

This is the **Base44-ready Heavens Gates web app project** created from the uploaded Base44 export and prepared for continued custom development.

The app is already structured as a React/Vite project with Base44 backend entities, Base44 functions, app routes, Tailwind styling, and the new Heavens Gates launch poster asset.

## What is inside

- Full Base44 source export
- React + Vite app shell
- Heavens Gates Chronicle route system
- Base44 entity definitions
- Base44 function definitions
- Barry Parker agent config
- Tailwind/ShadCN-style UI components
- Netlify deployment config
- SPA redirect support for Netlify refresh/deep-linking
- `.env.example` for Base44 environment setup
- Launch poster asset at `public/assets/heavens-gates-launch-poster.png`
- Project build docs inside `/docs`

## Main app routes

- `/` — Home / launch hub
- `/chronicle` — Read the Chronicle
- `/characters` — Character Vault
- `/bloodlines` — Bloodline Map
- `/empire` — The Empire
- `/timeline` — Timeline
- `/locations` — Columbia Archive
- `/soundtrack` — Soundtrack
- `/lore` — Hidden Lore
- `/notes` — Reader Notes
- `/community` — Fan Theories
- `/barry` — Talk to Barry agent
- `/academy` — Ownership Academy
- `/hd369` — HD 3,6,9 Doctrine
- `/promos` — Promo Videos
- `/beats` — Beat Store
- `/my-licenses` — My Licenses
- `/books` — Ebooks / Anu Narrative
- `/admin/ebooks` — Ebook Admin

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open the local Vite URL in your browser.

## Required Base44 environment variables

Create `.env.local` and set:

```bash
VITE_BASE44_APP_ID=your_base44_app_id
VITE_BASE44_APP_BASE_URL=https://heavens-gate-flow.base44.app
VITE_BASE44_FUNCTIONS_VERSION=
BASE44_LEGACY_SDK_IMPORTS=false
```

The app can open without these in some screens, but live Base44 data, entities, payment flows, agents, file uploads, and backend functions need the correct Base44 connection.

## Build

```bash
npm run build
```

## Netlify deployment

Use:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

This project already includes `netlify.toml` and `public/_redirects`.

## Project lane

Base44 is the prototype + backend structure. This repo is the build lane where the app can become a stronger owned product:

1. Stabilize local build and Netlify deployment.
2. Confirm Base44 environment variables.
3. Audit every route and mark what is live, placeholder, locked, or admin-only.
4. Replace temporary content with finalized Heavens Gates canon.
5. Build real content-entry workflows for books, chapters, tracks, characters, locations, lore, and doctrine.
6. Add ownership protection: copyright notice, licensing terms, content terms, and admin access rules.
7. Decide what stays Base44-backed and what eventually moves to a custom database/API.

## Important note

Do not publish private API keys or payment secrets into the browser code. Stripe secrets, webhook secrets, and server-only keys belong inside Base44 functions or secure platform environment variables.
