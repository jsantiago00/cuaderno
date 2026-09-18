# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps
npm run dev           # dev server (vite)
npm run build          # production build to dist/ (also regenerates the PWA service worker)
npm run preview        # serve the production build locally
npm run generate-icons  # regenerate public/pwa-*.png, favicon.ico, apple-touch-icon.png from public/favicon.svg
```

There is no test suite and no linter configured. `npm run build` is the closest thing to a correctness check (it fails on syntax/import errors).

To sanity-check a change against the real app in this sandbox: `npm run build && npm run preview -- --port 4173 --host 127.0.0.1`, then drive it with Playwright pointed at `/opt/pw-browsers/chromium-*/chrome-linux/chrome` (Playwright itself is not a project dependency — `npm install --no-save playwright` first if needed).

Local dev needs a real Firebase project's credentials in `.env` (see `.env.example` / README.md `## 1`). Without them, `firebaseConfigured` is `false` and the app renders the "missing config" screen instead of the login screen — that's expected, not a bug.

## Architecture

No frontend framework: plain JS + Vite, manual DOM rendering (`innerHTML` + `addEventListener`) with module-level state per view. There is no virtual DOM and no reactive re-render — each view file owns exactly when it repaints itself.

**Boot flow** (`src/main.js`): checks `firebaseConfigured` (from `src/firebase.js`, based on `VITE_FIREBASE_*` env vars) → resolves any pending Google redirect sign-in → `watchAuth()` mounts either `views/login.js` or `views/app-shell.js` depending on auth state.

**App shell** (`views/app-shell.js`): mounts `notes-view.js` and `learn-view.js` into sibling `<div>`s **simultaneously** and toggles visibility with an `is-hidden` CSS class instead of mounting/unmounting on tab switch. This is deliberate: it keeps the Firestore `onSnapshot` subscription and any in-progress note edit alive while the user is on the "Aprender" tab. `createNoteFromTemplate` is how `learn-view` hands a chosen poetic form to `notes-view` to start a new note.

**Notes state** (`views/notes-view.js`): Firestore is the source of truth (`state.notes`, from `subscribeNotes`), but while a note is being actively edited, `state.localPatch` holds the optimistic in-flight edit and the editor DOM is *not* re-rendered from incoming snapshots (to avoid clobbering cursor position / undoing keystrokes). Saves are debounced 700ms (`SAVE_DELAY`) and `localPatch` is cleared only after the Firestore write resolves. The sidebar list re-renders on every keystroke (cheap) but the editor `<textarea>`/inputs are only rebuilt on `selectNote()`.

**Data model**: `users/{uid}/notes/{noteId}` in Firestore, documents shaped `{ title, content, type: 'cancion'|'poema'|'otro', formId: string|null, createdAt, updatedAt }`. `firestore.rules` (repo root) enforces `request.auth.uid == userId` and must be pasted into the Firebase console manually — it is not deployed by any tooling here.

**Poetic forms** (`src/forms-data.js` + `src/syllables.js`): `poeticForms` is static content (haiku, copla, redondilla, décima, romance, soneto, letra de canción), each with a `template` describing line count and per-line syllable targets. `buildTemplateContent(form)` turns a form into the prefilled text of a new note. `syllables.js` is a from-scratch approximate Spanish syllabifier (vowel-nucleus detection, hiatus/diphthong rules, inseparable consonant clusters, sinalefa across word boundaries, and the "ley del acento final" aguda/esdrújula adjustment) — it's used live both in the notes editor (`updateSyllableHints`) and in the "practice" inputs on the learn view. When editing example verses in `forms-data.js`, verify the count with it; several example lines were originally off by one syllable until checked programmatically.

**Auth** (`src/auth.js`): picks `signInWithPopup` vs `signInWithRedirect` based on standalone-PWA/mobile detection, because popups are unreliable in installed/mobile contexts. `main.js` must call `resolveRedirectSignIn()` on every boot to catch the redirect result.

**PWA / deploy**: `vite.config.js` has `base: '/cuaderno/'` hardcoded for GitHub Pages project-site hosting — must be updated (and `start_url`/`scope` in the same file) if the repo is ever renamed. Icons are pre-generated static files in `public/`, not built from `favicon.svg` automatically — re-run `npm run generate-icons` after changing the source SVG. `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on push to `main`, reading the 6 `VITE_FIREBASE_*` values from repo secrets.

**Known deploy gotcha**: a fresh repo's auto-created `github-pages` *environment* can have a deployment-branch protection rule that doesn't include `main`, which makes the `deploy` job fail instantly with no runner assigned (empty `steps`, `runner_id: 0`) and no useful job log. Fix in Settings → Environments → `github-pages` → Deployment branches and tags.

**Auth domains**: Firebase's Authentication → Authorized domains list must include every domain the app is actually served from — the default `*.github.io` domain *and*, separately, any custom domain configured for GitHub Pages (e.g. via a `CNAME`). Missing this causes a silent-ish "No se pudo iniciar sesión" failure with no specific error surfaced to the user (see `views/login.js`'s catch block).
