# Palantir-inspired landing page redesign

Date: 2026-09-27

## Goal

Replace the root route (`/`) with a bespoke, hand-authored landing page inspired by
Palantir.com's design language. The existing portfolio-generator flow at `/submit`,
the admin dashboard, and the classic template it renders remain untouched.

## Non-goals

- No changes to `/submit`, `/dashboard`, API routes, `components/shared`,
  `components/layout`, `templates/classic`, Prisma, or Supabase.
- No light mode, no theme toggle.
- No new npm dependencies.
- The new page is not driven by `site.config.json`.

## Content source

All copy lives in one typed file, `content/profile.ts`, exporting a `profile` object:

- `name`, `tagline` (the resume tagline), `bio` (two paragraphs)
- `links`: email `maxtrinh4@gmail.com`, GitHub `https://github.com/maximillionare2030`,
  LinkedIn `TODO_LINKEDIN_URL` placeholder, generator link `/submit`
- `skills`: 12 entries, name plus image path
- `experience`: 9 roles in reverse chronological display order:
  1. Forward Deployed Engineer, Palantir (incoming), dates and bullets marked TODO
  2. Software Development Engineer Intern, Amazon, dates and bullets marked TODO
  3. Software Engineering Intern, Visa, dates and bullets marked TODO
  4. Software Engineering Intern, L3Harris Technologies, Jun 2024 to Present
  5. QA Software Engineer, L3Harris Technologies, Jun 2024 to Sep 2025
  6. Project Lead, Resumify, Jun 2025 to Aug 2025
  7. Full-Stack Developer, Learning & Decision Neuroscience Lab, Dec 2024 to Jul 2025
  8. Software Engineer, FSAE Anteater Electric Racing, Sep 2024 to Jun 2025
  9. Clerical Assistant, Farmers Insurance, Jun 2020 to Sep 2021
  Roles 4 to 9 copy bullets from the current `site.config.json`. Roles 1 to 3 have
  `logo: null` and render a text wordmark; bullets are a single `TODO: add bullets`
  string so they are obvious in the UI until filled in.
- `projects`: the 4 projects from `site.config.json` with image, tags, and links.

Image paths reference the `1766646169991` batch in `public/uploads`:
`about-1766646169991.PNG`, `experience-{0..5}-1766646169991.*`,
`project-{0..3}-1766646169991.*`, `skill-{0..11}-1766646169991.*`.
Mapping of experience logos to roles follows the current config indexes
(0 L3Harris intern, 1 LDN Lab, 2 FSAE, 3 Resumify, 4 L3Harris QA, 5 Farmers).

## Architecture

- `app/page.tsx`: server component. Exports `metadata` (title "Max Truong",
  description = tagline). Renders `<Landing />`. The existing config-reading code
  and the `Suspense` spinner are removed from this file.
- `components/landing/Landing.tsx`: composes Nav, Hero, About, Skills, Experience,
  Projects, Footer inside a wrapper `div` that applies the fonts and CSS variables.
- `components/landing/Nav.tsx`, `Hero.tsx`, `About.tsx`, `Skills.tsx`,
  `Experience.tsx`, `Projects.tsx`, `Footer.tsx`: presentational server components
  receiving slices of `profile`.
- `components/landing/Reveal.tsx`: the only client component. Wraps children and
  uses IntersectionObserver to add a `data-visible` attribute once; CSS handles a
  fade plus 8px rise. Respects `prefers-reduced-motion`.
- `components/landing/SectionLabel.tsx`: mono eyebrow like `01 / ABOUT`.
- `components/landing/landing.css`: scoped styles under `.landing` for the CSS
  variables, hairline grid, reveal animation, and grayscale image filters.
  Imported from `Landing.tsx`.
- `lib/landing-fonts.ts`: `next/font/google` loaders for Inter and IBM Plex Mono
  exposed as CSS variables `--font-landing-sans` and `--font-landing-mono`.

The root `app/layout.tsx` is unchanged. It still applies the config font to `body`;
the landing wrapper overrides `font-family` so the classic theme does not leak in.

## Visual system

- Background `#050505`, surface `#0a0a0a`, text `#f5f5f5`, muted `#8a8a8a`,
  hairline `#262626`, accent `#2d72d2` (hover and active states only).
- `border-radius: 0` everywhere on the landing page.
- Inter for body and headlines. IBM Plex Mono, uppercase, letter-spacing 0.08em,
  for eyebrows, section numbers, dates, tags, and nav links.
- Layout: max width 1280px, 24px gutters on mobile, 48px on desktop. Sections are
  separated by full-bleed 1px hairlines. Section number and label sit in a mono
  eyebrow at the top left of each section.
- Images: `next/image`, `grayscale(1)` at rest, full color on hover for skill logos
  and project images. About photo stays in color inside a hairline frame.

## Sections

1. **Nav**: sticky, hairline bottom border, blurred black background. Left: name in
   mono. Right: anchor links About, Skills, Experience, Projects, and an external
   style link "Portfolio generator" to `/submit`. On mobile the anchor links collapse
   to a horizontally scrollable row.
2. **Hero**: full viewport height minus nav. Eyebrow `SOFTWARE ENGINEER`. Headline
   two lines, ~clamp(2.5rem, 7vw, 6rem): "Max Truong" then a short statement line.
   Tagline paragraph in muted. Row of mono links: Email, GitHub, LinkedIn.
3. **About** (`01 / ABOUT`): two columns on desktop. Left: photo in hairline frame.
   Right: bio paragraphs.
4. **Skills** (`02 / SKILLS`): grid of 12 hairline cells, 6 columns on desktop, 3 on
   mobile. Each cell: logo centered, name in mono beneath.
5. **Experience** (`03 / EXPERIENCE`): stacked rows divided by hairlines. Left
   column mono dates. Right: role, company (with 24px logo or text wordmark),
   bullet list. TODO roles show the placeholder bullet visibly.
6. **Projects** (`04 / PROJECTS`): 2x2 grid of hairline cards. Image on top (16:9
   crop), title, description, mono tag row, links row (GitHub, Try it out).
7. **Footer**: hairline top. Links repeated, copyright line, and "Built with the
   portfolio generator at /submit".

## Error handling

Static content, no runtime data fetching, so no error states. Missing `logo`
falls back to a text wordmark. Images have `alt` from the profile data.

## Testing and verification

- `npm run build` passes with no type errors.
- Existing Jest tests still pass.
- Manual: root renders at 375px and 1440px in the browser with no horizontal
  scroll; `/submit` still renders the classic preview.
