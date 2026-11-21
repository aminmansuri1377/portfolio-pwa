# Portfolio — Mohamad Amin Mansori

Personal portfolio website, built for the German job market. Bilingual
(German / English), dark editorial design, interactive 3D hero and
scroll-driven motion. Installable as a PWA.

## Tech stack

- **Next.js 14** (Pages Router) + **React 18**
- **next-intl** — i18n with `de` (default) and `en` locales
- **Tailwind CSS 3** — design system (ink / lime / violet)
- **Three.js** via `@react-three/fiber` + `@react-three/drei` — hero scene
- **Framer Motion** — reveal, parallax and micro-interactions
- **Lenis** — smooth scrolling
- `next/font` — self-hosted Google fonts (DSGVO-friendly, no external requests)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 (German) or http://localhost:3000/en (English).

> The first build downloads fonts via `next/font`, so it needs internet access.

## Structure

- `messages/de.json`, `messages/en.json` — all copy in both languages
- `lib/projects.js` — project data (add new projects here)
- `lib/skills.js` — skill groups and icons
- `components/sections/*` — homepage sections
- `components/three/HeroScene.jsx` — the 3D hero (lazy-loaded, reduced-motion aware)
- `pages/projects/[slug].jsx` — case-study pages
- `pages/cv.jsx` — printable CV (Lebenslauf)

## Adding a new project

1. Add an entry to `lib/projects.js` (images go to `public/assets/projects/`).
2. Add the copy under `Projects.cases.<slug>` in **both** message files.
3. The card, case-study page and routing are generated automatically.

## Legal

`pages/impressum.jsx` and `pages/datenschutz.jsx` contain placeholders that
must be replaced with real contact details before going live.
