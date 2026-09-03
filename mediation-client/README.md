# mediation-client

The frontend for the HR workplace-mediation platform (see
`../supabase/migrations/0003_mediation_platform.sql` and
`../supabase/MEDIATION_PLATFORM.md` for the schema this talks to) — a
**separate app** from `../client/` (the concierge desk site). They share
one Supabase project but have no other overlap: different domain, different
branding, different login system entirely.

## What's built so far

Just the landing hero and the sections around it — no auth, no dashboards
yet:

- `src/components/HeroSection.tsx` — video-background hero (drop a real
  `hero-bg.mp4` / `hero-poster.jpg` into `public/` to activate it; an
  animated gradient layer carries the scene until you do) with staggered
  Framer Motion text reveals, floating glass metric cards, and dual CTAs.
- `src/components/Card3D.tsx` — reusable glass card with cursor-driven 3D
  tilt and a spotlight glow, used by the "mediation pillars" cards.
- `src/components/MagneticButton.tsx` — cursor-attraction button wrapper.
- `src/components/Navbar.tsx` — sticky header that shrinks into a
  glassmorphic pill past 50px of scroll.
- `src/components/ProcessTimeline.tsx` — a GSAP ScrollTrigger timeline
  (Intake → Pre-Mediation → Joint Session → Resolution) with a hand-drawn
  SVG line and step highlighting, synced to Lenis smooth scroll.
- `src/lib/smooth-scroll.ts` — the Lenis hook, wired into GSAP's ticker so
  ScrollTrigger and Lenis agree on scroll position.

## Local development

```bash
cd mediation-client
npm install
cp .env.example .env
# fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — same project as
# client/.env, from Supabase Settings → API
npm run dev
```

Opens on **http://localhost:5174** (client/ uses 5173, so both can run at
once).

## Still to build

Auth (Supabase Auth against the `profiles` table), role-based dashboards
for admin/mediator/hr_client/participant, the case intake form, and a
Vercel project of its own once there's enough here to deploy.
