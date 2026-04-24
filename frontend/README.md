# Moment Crafter

A beautiful, interactive digital greetings platform built with **React** + **Vite**.

## Tech Stack

- **React** — Component-based UI
- **Vite** — Fast build tooling
- **GSAP** + ScrollTrigger — Scroll-driven animations
- **Lenis** — Smooth scrolling
- **Matter.js** — Physics engine (footer playground)
- **Canvas API** — Particle effects (dot grid, category heading, how-it-works morphing)
- **canvas-confetti** — Celebration effects

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── main.jsx              # React entry point
├── App.jsx               # Root component (Lenis + section composition)
├── index.css             # Global reset, CSS variables, noise overlay
├── components/
│   ├── NoiseOverlay.jsx  # Grain texture overlay
│   ├── DotGrid.jsx       # Interactive canvas dot grid background
│   ├── HeroSection.jsx   # Scroll-driven 6-phase hero animation
│   ├── CategoriesCarousel.jsx  # 3D carousel + particle heading
│   ├── HowItWorks.jsx    # Particle morphing + sticky card scroll
│   ├── Customization.jsx # Tabbed wizard + iframe live preview
│   ├── FAQ.jsx           # Chat-style animated accordion
│   └── Footer.jsx        # Matter.js physics playground
└── styles/               # Per-section CSS files
```

## Build

```bash
npm run build
```

Output goes to `dist/`.
