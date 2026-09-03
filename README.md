# Kaku Craft — Artisanal Crochet & Fiber Studio

A bespoke, single-page storefront for Kaku Craft, a hand-crafted crochet and fiber
studio based in Addis Ababa. The site showcases sculptural cardigans, heirloom
amigurumi dolls, and unique fiber artifacts through an elegant, editorial browsing
experience.

![Next.js](https://img.shields.io/badge/Next.js-16-000000) ![React](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind_4-CSS-38bdf8)

## Overview

Kaku Craft is built as a single-page application with client-side view switching
(`landing`, `shop`, `about`, `contact`), letting visitors move fluidly from an
immersive landing experience through to product discovery, the studio story, and
bespoke commission requests — all without a page reload.

### Features

- **Editorial landing experience** — hero, interactive product lineup, studio craft
  pillars, and a bespoke commission call-to-action.
- **Product catalog** — a permanent collection with category filtering
  (wearables, dolls, accessories, home).
- **Quick view modal** — inspect a product in detail without leaving the collection.
- **Shopping bag** — live cart count updated on add-to-cart.
- **Immersive details** — custom cursor, floating yarn thread ambience, smooth
  scrolling, and a refined warm palette.
- **Responsive & accessible** — responsive layouts and a carefully chosen,
  high-contrast dark-on-cream design system.

## Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Framework  | [Next.js](https://nextjs.org) 16 (App Router)          |
| UI         | [React](https://react.dev) 19, TypeScript              |
| Styling    | [Tailwind CSS](https://tailwindcss.com) 4               |
| Icons      | [lucide-react](https://lucide.dev)                     |
| Fonts      | Cormorant Garamond, Plus Jakarta Sans, Space Mono      |
| Imagery    | Unsplash (configured via remote image patterns)        |

## Getting Started

### Prerequisites

- Node.js 20.x (or the version required by your Next.js setup)

### Installation

```bash
# Install dependencies
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the site.

The app hot-reloads as you edit files under `src/`.

## Available Scripts

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Start the development server        |
| `npm run build`    | Create an optimized production build |
| `npm run start`    | Start the production server         |
| `npm run lint`     | Run ESLint                          |

## Project Structure

```
src/
├── app/                    # Next.js App Router root
│   ├── layout.tsx          # Root layout, fonts, global cursor
│   ├── page.tsx            # SPA entry — view switching & state
│   └── globals.css         # Global design tokens & styles
├── components/
│   ├── landing/            # Landing page sections
│   ├── layout/             # Navigation & footer
│   ├── ui/                 # Reusable primitives (cursor, cards, modal)
│   └── views/              # Top-level page views
├── data/
│   └── products.ts         # Product catalog
└── types/
    └── index.ts            # Shared TypeScript types
```

## Configuration Notes

- **Remote images** — `next.config.ts` whitelists the `images.unsplash.com` host
  for the product imagery via Next.js Image Optimization.
- **Fonts** — loaded at runtime with `next/font`, exposing `--font-serif`,
  `--font-sans`, and `--font-mono` CSS variables.
- **Palette** — the design system (ink `#2C302E`, cream `#FDFBF7`, clay `#D4A373`,
  sage `#A3B19B`) is applied directly via Tailwind arbitrary values.

## Deployment

This is a standard Next.js App Router application and can be deployed anywhere
that supports Node.js.

The simplest path is the [Vercel Platform](https://vercel.com/new). See the
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for other hosting options (Netlify, AWS, self-hosting, etc.).

```bash
npm run build
npm run start
```

## License

© Kaku Craft. All rights reserved.