# SD Innovations — website

Marketing site for SD Innovations, built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Highlights

- **Homepage scroll story** (inspired by philos.site): Sterling-style sky hero, a held "Humanising technology" section, a sideways-scrolling capabilities row, and a "Why us" wall with a 01/04 counter.
- **Travelling background**: one aurora light-streak shader (three.js / React Three Fiber) that moves through the homepage behind the content.
- **Motion**: GSAP (ScrollTrigger, SplitText) synced with Lenis smooth scrolling; everything respects `prefers-reduced-motion`.
- **Pages**: Home, Services, Case Studies (+ 5 detail pages), Contact, Careers, Privacy, Terms.
- **Light / dark mode**: toggle in the nav, remembered per visitor, defaults to the system setting.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes before launch

- Privacy, Terms and Careers show holding text — the live site has no content for them yet.
- The contact form opens the visitor's email app (no form backend is connected yet).
- Content lives in `src/lib/content.ts`.
