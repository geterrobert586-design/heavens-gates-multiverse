# Netlify and Environment Setup

## Netlify build settings

Use these exact settings:

```text
Build command: npm run build
Publish directory: dist
Node version: 20
```

The included `netlify.toml` already defines the build command, publish folder, Node version, and single-page app redirect.

## Environment variables in Netlify

In Netlify, go to:

```text
Site configuration → Environment variables
```

Add:

```text
VITE_BASE44_APP_ID
VITE_BASE44_APP_BASE_URL
VITE_BASE44_FUNCTIONS_VERSION
BASE44_LEGACY_SDK_IMPORTS
```

Set `VITE_BASE44_APP_BASE_URL` to:

```text
https://heavens-gate-flow.base44.app
```

Set `BASE44_LEGACY_SDK_IMPORTS` to:

```text
false
```

Only set `VITE_BASE44_FUNCTIONS_VERSION` if Base44 gives you a specific version value.

## Local development

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with the real Base44 app ID and backend URL.

## Common issues

### Page works on homepage but refresh breaks on subpages

That is a single-page app redirect issue. This project includes both `netlify.toml` and `public/_redirects` to fix it.

### App opens but data does not load

Check `VITE_BASE44_APP_ID` and `VITE_BASE44_APP_BASE_URL`.

### Payment functions fail

Payment and webhook secrets must be configured in the secure Base44 function environment. Do not place secret keys inside front-end files.
