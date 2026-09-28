# Palantir-Inspired Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the root route `/` with a hand-authored, dark, Palantir-inspired landing page while leaving `/submit`, `/dashboard`, and the classic template untouched.

**Architecture:** `app/page.tsx` becomes a plain server component rendering `components/landing/Landing.tsx`, which composes seven presentational sections fed by a single typed data file `content/profile.ts`. One client component (`Reveal`) handles scroll-in fades. Styles are scoped under a `.landing` class in `components/landing/landing.css`; fonts come from `next/font/google` via `lib/landing-fonts.ts`.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind 3 (existing), `next/font`, `next/image`, Jest (existing, node environment for data tests).

## Global Constraints

- No new npm dependencies.
- Do not modify anything under `components/shared`, `components/layout`, `templates/`, `app/(public)`, `app/(admin)`, `app/api`, `prisma/`, `lib/` (other than adding `lib/landing-fonts.ts`), or `types/site.ts`.
- `app/layout.tsx` is unchanged.
- No light mode. Colors: background `#050505`, surface `#0a0a0a`, text `#f5f5f5`, muted `#8a8a8a`, hairline `#262626`, accent `#2d72d2` (hover/active only).
- `border-radius: 0` everywhere inside `.landing`.
- Fonts: Inter (body, headlines), IBM Plex Mono (eyebrows, dates, tags, nav links), mono is uppercase with `letter-spacing: 0.08em`.
- Image paths must point at the `1766646169991` batch in `public/uploads`.
- Placeholders allowed only where the spec says: LinkedIn URL and the dates/bullets for Palantir, Amazon, Visa.
- Commit message trailer on every commit: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Prerequisite

`node_modules` is not installed. Before Task 1 run:

```bash
cd /Users/maximilliantruong/Desktop/SWE/projects/landing-page-maximillian-truong
pnpm install
```

Expected: completes without error; `node_modules/.bin/jest` and `node_modules/.bin/next` exist. If `pnpm` is unavailable use `npm install`. The `postinstall` runs `prisma generate`; if it fails because `DATABASE_URL` is missing, run `DATABASE_URL="postgresql://x:x@localhost:5432/x" pnpm install`.

## File Structure

| Path | Responsibility |
|---|---|
| `content/profile.ts` | All copy, links, image paths. Exports `profile` and its types. |
| `__tests__/profile.test.ts` | Data integrity: counts, required fields, image files exist on disk. |
| `lib/landing-fonts.ts` | `next/font/google` loaders for Inter and IBM Plex Mono. |
| `components/landing/landing.css` | Scoped CSS variables, utility classes, reveal animation, image filters. |
| `components/landing/Reveal.tsx` | Client component: IntersectionObserver fade-in. |
| `components/landing/SectionLabel.tsx` | Mono eyebrow `01 / ABOUT`. |
| `components/landing/Landing.tsx` | Composes sections in the font/variable wrapper. |
| `components/landing/Nav.tsx` | Sticky hairline nav. |
| `components/landing/Hero.tsx` | Full-height hero. |
| `components/landing/About.tsx` | Photo + bio. |
| `components/landing/Skills.tsx` | 12-cell logo grid. |
| `components/landing/Experience.tsx` | Stacked roles. |
| `components/landing/Projects.tsx` | 2x2 project cards. |
| `components/landing/Footer.tsx` | Links + credit line. |
| `app/page.tsx` | Replaced: exports `metadata`, renders `<Landing />`. |

---

### Task 1: Content data file with integrity test

**Files:**
- Create: `content/profile.ts`
- Test: `__tests__/profile.test.ts`

**Interfaces:**
- Produces: `profile: Profile`, and types `Profile`, `ProfileLink`, `Skill`, `Role`, `Project` from `@/content/profile`.

- [ ] **Step 1: Write the failing test**

Create `__tests__/profile.test.ts`:

```ts
/**
 * @jest-environment node
 */
import { existsSync } from "fs";
import { join } from "path";
import { profile } from "@/content/profile";

const uploads = (p: string) => join(process.cwd(), "public", p);

describe("profile content", () => {
  it("has core identity fields", () => {
    expect(profile.name).toBe("Max Truong");
    expect(profile.tagline.length).toBeGreaterThan(10);
    expect(profile.bio).toHaveLength(2);
  });

  it("has the four required links", () => {
    const labels = profile.links.map((l) => l.label);
    expect(labels).toEqual(["Email", "GitHub", "LinkedIn", "Portfolio generator"]);
    expect(profile.links[0].href).toBe("mailto:maxtrinh4@gmail.com");
    expect(profile.links[1].href).toBe("https://github.com/maximillionare2030");
    expect(profile.links[3].href).toBe("/submit");
  });

  it("has 12 skills with existing images", () => {
    expect(profile.skills).toHaveLength(12);
    for (const s of profile.skills) {
      expect(s.image).toMatch(/^\/uploads\/skill-\d+-1766646169991\./);
      expect(existsSync(uploads(s.image))).toBe(true);
    }
  });

  it("has 9 roles, newest first, with the three new companies first", () => {
    expect(profile.experience).toHaveLength(9);
    expect(profile.experience.slice(0, 3).map((r) => r.company)).toEqual([
      "Palantir",
      "Amazon",
      "Visa",
    ]);
    for (const r of profile.experience) {
      expect(r.role.length).toBeGreaterThan(0);
      expect(r.bullets.length).toBeGreaterThan(0);
      if (r.logo) expect(existsSync(uploads(r.logo))).toBe(true);
    }
  });

  it("has 4 projects with existing images and at least one link each", () => {
    expect(profile.projects).toHaveLength(4);
    for (const p of profile.projects) {
      expect(existsSync(uploads(p.image))).toBe(true);
      expect(p.links.length).toBeGreaterThan(0);
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it("about photo exists", () => {
    expect(existsSync(uploads(profile.aboutImage.src))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/profile.test.ts`
Expected: FAIL with `Cannot find module '@/content/profile'`.

- [ ] **Step 3: Write the data file**

Create `content/profile.ts`:

```ts
export type ProfileLink = {
  label: string;
  href: string;
  external: boolean;
};

export type Skill = {
  name: string;
  image: string;
};

export type Role = {
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
  /** Path under /public, or null to render a text wordmark. */
  logo: string | null;
  /** True for roles whose dates/bullets are placeholders. */
  todo?: boolean;
};

export type Project = {
  title: string;
  description: string;
  image: string;
  alt: string;
  tags: string[];
  links: { label: string; href: string }[];
};

export type Profile = {
  name: string;
  eyebrow: string;
  headline: string;
  tagline: string;
  bio: string[];
  aboutImage: { src: string; alt: string };
  links: ProfileLink[];
  skills: Skill[];
  experience: Role[];
  projects: Project[];
};

const B = "1766646169991";

export const profile: Profile = {
  name: "Max Truong",
  eyebrow: "Software Engineer",
  headline: "Systems that hold up in production.",
  tagline:
    "Software Engineer | Full-Stack & Backend | .NET, React, TypeScript, Python | Distributed Systems & Automation",
  bio: [
    "Hi! My name is Max and I'm a current third-year Computer Engineering student at the University of California, Irvine, pursuing a minor in Digital Information Systems.",
    "In my free time, I enjoy working on personal projects with my friends and exploring different genres of Software Engineering, like Embedded Systems, which has allowed me to become a well-rounded engineer.",
  ],
  aboutImage: { src: `/uploads/about-${B}.PNG`, alt: "Max Truong" },
  links: [
    { label: "Email", href: "mailto:maxtrinh4@gmail.com", external: false },
    { label: "GitHub", href: "https://github.com/maximillionare2030", external: true },
    // TODO: replace with your LinkedIn profile URL
    { label: "LinkedIn", href: "https://www.linkedin.com/in/TODO_LINKEDIN_URL", external: true },
    { label: "Portfolio generator", href: "/submit", external: false },
  ],
  skills: [
    { name: "TypeScript", image: `/uploads/skill-0-${B}.png` },
    { name: "React", image: `/uploads/skill-1-${B}.png` },
    { name: "Python", image: `/uploads/skill-2-${B}.jpg` },
    { name: "C/C++", image: `/uploads/skill-3-${B}.jpg` },
    { name: "Java", image: `/uploads/skill-4-${B}.png` },
    { name: "C#", image: `/uploads/skill-5-${B}.png` },
    { name: ".NET Core", image: `/uploads/skill-6-${B}.png` },
    { name: "Django", image: `/uploads/skill-7-${B}.jpg` },
    { name: "AWS", image: `/uploads/skill-8-${B}.png` },
    { name: "SQL", image: `/uploads/skill-9-${B}.png` },
    { name: "NoSQL", image: `/uploads/skill-10-${B}.png` },
    { name: "PostgreSQL", image: `/uploads/skill-11-${B}.png` },
  ],
  experience: [
    {
      role: "Forward Deployed Engineer",
      company: "Palantir",
      start: "Incoming",
      end: "",
      bullets: ["TODO: add bullets"],
      logo: null,
      todo: true,
    },
    {
      role: "Software Development Engineer Intern",
      company: "Amazon",
      start: "TODO: start",
      end: "TODO: end",
      bullets: ["TODO: add bullets"],
      logo: null,
      todo: true,
    },
    {
      role: "Software Engineering Intern",
      company: "Visa",
      start: "TODO: start",
      end: "TODO: end",
      bullets: ["TODO: add bullets"],
      logo: null,
      todo: true,
    },
    {
      role: "Software Engineering Intern",
      company: "L3Harris Technologies",
      start: "Jun 2024",
      end: "Present",
      bullets: [
        "Reduced manual testing time by over 67% by building a large-scale testing application using ASP.NET Core and ReactJS",
        "Improved internal tool deployment and scalability by 30% through Jenkins CI/CD pipelines and distributed Docker and Kubernetes microservices integrating SQL and MQTT for securely hosted on-prem applications used by 300+ engineers",
        "Solved 15+ years of technical debt by creating an in-house interpreter to convert 500+ legacy scripting files into Python",
      ],
      logo: `/uploads/experience-0-${B}.png`,
    },
    {
      role: "QA Software Engineer",
      company: "L3Harris Technologies",
      start: "Jun 2024",
      end: "Sep 2025",
      bullets: [
        "Supported DevOps workflows for company-wide Python libraries, focusing on maintainability and integration",
        "Contributed to the development of an internal production-level testing service used across engineering teams",
      ],
      logo: `/uploads/experience-4-${B}.png`,
    },
    {
      role: "Project Lead",
      company: "Resumify",
      start: "Jun 2025",
      end: "Aug 2025",
      bullets: [
        "Directed a 6-member cross-functional team (developers, designer, content strategist) to prototype an MVP resume-generation platform in under 90 days using Agile and bi-weekly sprints",
        "Spearheaded the design of backend architecture with PostgreSQL, Django REST, and AWS services and the deployment plan",
        "Coordinated development of resume parsing pipelines leveraging AWS Textract and Comprehend",
      ],
      logo: `/uploads/experience-3-${B}.jpg`,
    },
    {
      role: "Full-Stack Developer",
      company: "Learning & Decision Neuroscience Lab",
      start: "Dec 2024",
      end: "Jul 2025",
      bullets: [
        "Led full development of real-time multiplayer systems for behavioral experiments, supporting 4+ research cohorts",
        "Implemented secure, low-latency communication with WebSockets and Supabase, ensuring data integrity in live trials",
        "Applied deep learning models for interpretation, enhancing analytical accuracy by 25% and improving research throughput",
      ],
      logo: `/uploads/experience-1-${B}.jpg`,
    },
    {
      role: "Software Engineer",
      company: "FSAE Anteater Electric Racing",
      start: "Sep 2024",
      end: "Jun 2025",
      bullets: [
        "Developed real-time telemetry systems in C++ with 95% higher sampling accuracy and 100% uptime during multiple races",
        "Integrated safety-critical features compliant with 50+ regulations, ensuring operational integrity and reliability",
        "Collaborated in a 150+ member cross-disciplinary team optimizing control systems, data pipelines, and firmware safety logic",
      ],
      logo: `/uploads/experience-2-${B}.jpg`,
    },
    {
      role: "Clerical Assistant",
      company: "Farmers Insurance",
      start: "Jun 2020",
      end: "Sep 2021",
      bullets: [
        "Spearheaded workflows by utilizing Salesforce CRMs to modularize databases",
        "Assisted in customer service, informational, and organizational tasks",
      ],
      logo: `/uploads/experience-5-${B}.png`,
    },
  ],
  projects: [
    {
      title: "AER Embedded Platform",
      description:
        "Embedded firmware for a student-built electric racecar, integrating sensor interfaces, control logic, and safety-oriented behaviors while supporting telemetry and logging for validation.",
      image: `/uploads/project-0-${B}.jpg`,
      alt: "AER embedded platform",
      tags: ["C/C++", "Rust", "MQTT", "CAN", "React", "TypeScript"],
      links: [{ label: "GitHub", href: "https://github.com/Anteater-Electric-Racing/embedded" }],
    },
    {
      title: "AER Telemetry Dashboard",
      description:
        "Telemetry dashboard for Anteater Electric Racing that visualizes live vehicle data (speed, temps, battery, motor metrics) with a driver- and engineer-friendly UI for testing and track sessions.",
      image: `/uploads/project-1-${B}.png`,
      alt: "AER telemetry dashboard",
      tags: ["FastAPI", "Python", "NumPy", "React", "TypeScript", "MQTT", "Grafana"],
      links: [{ label: "GitHub", href: "https://github.com/maximillionare2030/telemetry-dashboard" }],
    },
    {
      title: "Portfolio Generator",
      description:
        "A portfolio-in-a-box web app that turns structured form input (projects, experience, links) into a deployable personal site with reusable templates and a clean responsive design.",
      image: `/uploads/project-2-${B}.jpg`,
      alt: "Portfolio generator",
      tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "PostgreSQL", "Supabase"],
      links: [
        { label: "GitHub", href: "https://github.com/maximillionare2030/landing-page-maximillian-truong" },
        { label: "Try it out", href: "/submit" },
      ],
    },
    {
      title: "Mentally",
      description:
        "Wellness app that helps users track mood and habits, reflect through journaling, and spot patterns over time through lightweight analytics and clean UX.",
      image: `/uploads/project-3-${B}.jpg`,
      alt: "Mentally wellness app",
      tags: ["React", "TypeScript", "Firebase", "OpenAI API", "PyTorch"],
      links: [
        { label: "GitHub", href: "https://github.com/maximillionare2030/Mentally" },
        { label: "Try it out", href: "https://mentrally-tracker.org" },
      ],
    },
  ],
};
```

Note: the original config had the GitHub links for projects 0 and 1 swapped (the embedded project pointed at the telemetry repo and vice versa). This file assigns each project its matching repo.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/profile.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add content/profile.ts __tests__/profile.test.ts
git commit -m "Add hand-authored profile content for new landing page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Fonts, scoped CSS, Reveal, SectionLabel, Landing shell, and page swap

**Files:**
- Create: `lib/landing-fonts.ts`
- Create: `components/landing/landing.css`
- Create: `components/landing/Reveal.tsx`
- Create: `components/landing/SectionLabel.tsx`
- Create: `components/landing/Landing.tsx`
- Modify: `app/page.tsx` (replace entire file)

**Interfaces:**
- Consumes: `profile` from Task 1.
- Produces:
  - `landingSans`, `landingMono` from `@/lib/landing-fonts` (next/font objects with `.variable`).
  - `Reveal({ children, className?, delay? }: { children: React.ReactNode; className?: string; delay?: number })`.
  - `SectionLabel({ number, label }: { number: string; label: string })`.
  - CSS classes used by later tasks: `.landing`, `.mono`, `.hairline-t`, `.hairline-b`, `.hairline`, `.container-x`, `.img-mono`, `.link`, `.reveal`.

- [ ] **Step 1: Create the font loaders**

Create `lib/landing-fonts.ts`:

```ts
import { Inter, IBM_Plex_Mono } from "next/font/google";

export const landingSans = Inter({
  subsets: ["latin"],
  variable: "--font-landing-sans",
  display: "swap",
});

export const landingMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-landing-mono",
  display: "swap",
});
```

- [ ] **Step 2: Create the scoped stylesheet**

Create `components/landing/landing.css`:

```css
.landing {
  --bg: #050505;
  --surface: #0a0a0a;
  --text: #f5f5f5;
  --muted: #8a8a8a;
  --hairline: #262626;
  --accent: #2d72d2;

  background: var(--bg);
  color: var(--text);
  font-family: var(--font-landing-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.landing *,
.landing *::before,
.landing *::after {
  border-radius: 0 !important;
}

.landing ::selection {
  background: var(--accent);
  color: #fff;
}

.landing .mono {
  font-family: var(--font-landing-mono), ui-monospace, monospace;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  line-height: 1.2;
}

.landing .hairline-t { border-top: 1px solid var(--hairline); }
.landing .hairline-b { border-bottom: 1px solid var(--hairline); }
.landing .hairline { border: 1px solid var(--hairline); }

.landing .container-x {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
}
@media (min-width: 768px) {
  .landing .container-x { padding-left: 48px; padding-right: 48px; }
}

.landing .link {
  color: var(--text);
  text-decoration: none;
  transition: color 150ms ease;
}
.landing .link:hover,
.landing .link:focus-visible {
  color: var(--accent);
  outline: none;
}

.landing .img-mono {
  filter: grayscale(1);
  opacity: 0.85;
  transition: filter 250ms ease, opacity 250ms ease;
}
.landing .img-mono:hover,
.landing .group:hover .img-mono {
  filter: grayscale(0);
  opacity: 1;
}

.landing .reveal {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 500ms ease, transform 500ms ease;
  transition-delay: var(--reveal-delay, 0ms);
}
.landing .reveal[data-visible="true"] {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .landing .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.landing .nav-blur {
  background: rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.landing .todo {
  color: var(--accent);
}
```

- [ ] **Step 3: Create the Reveal client component**

Create `components/landing/Reveal.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the fade starts once visible. */
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible ? "true" : "false"}
      style={{ ["--reveal-delay" as string]: `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create SectionLabel**

Create `components/landing/SectionLabel.tsx`:

```tsx
type SectionLabelProps = {
  number: string;
  label: string;
};

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <p className="mono" style={{ color: "var(--muted)" }}>
      {number} / {label}
    </p>
  );
}
```

- [ ] **Step 5: Create the Landing shell (sections stubbed as comments for now)**

Create `components/landing/Landing.tsx`:

```tsx
import { landingSans, landingMono } from "@/lib/landing-fonts";
import { profile } from "@/content/profile";
import "./landing.css";

export function Landing() {
  return (
    <div className={`landing ${landingSans.variable} ${landingMono.variable}`}>
      <main>
        <section className="container-x py-24">
          <h1 className="text-5xl font-medium tracking-tight">{profile.name}</h1>
        </section>
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Replace app/page.tsx**

Overwrite `app/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: profile.name,
  description: profile.tagline,
};

export default function HomePage() {
  return <Landing />;
}
```

- [ ] **Step 7: Type-check and build**

Run: `npx tsc --noEmit && npm run build`
Expected: tsc prints nothing; build ends with the route table including `○ /` and `○ /submit` (or `ƒ` for dynamic routes) and no errors. If the build fails on `prisma generate` due to a missing `DATABASE_URL`, prefix the command with `DATABASE_URL="postgresql://x:x@localhost:5432/x"`.

- [ ] **Step 8: Commit**

```bash
git add lib/landing-fonts.ts components/landing app/page.tsx
git commit -m "Swap root page to new landing shell with scoped styles and Reveal

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Nav and Hero

**Files:**
- Create: `components/landing/Nav.tsx`
- Create: `components/landing/Hero.tsx`
- Modify: `components/landing/Landing.tsx`

**Interfaces:**
- Consumes: `profile`, `Reveal`, CSS classes from Task 2.
- Produces: `Nav()` and `Hero()` components (no props; they read `profile` directly).

- [ ] **Step 1: Create Nav**

Create `components/landing/Nav.tsx`:

```tsx
import Link from "next/link";
import { profile } from "@/content/profile";

const anchors = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

export function Nav() {
  const generator = profile.links.find((l) => l.label === "Portfolio generator");
  return (
    <header className="sticky top-0 z-50 nav-blur hairline-b">
      <nav className="container-x flex items-center justify-between h-14 gap-6">
        <a href="#top" className="mono link whitespace-nowrap">
          {profile.name}
        </a>
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="mono link">
              {a.label}
            </a>
          ))}
          {generator && (
            <Link href={generator.href} className="mono link" style={{ color: "var(--muted)" }}>
              {generator.label} ↗
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create Hero**

Create `components/landing/Hero.tsx`:

```tsx
import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";

export function Hero() {
  const contact = profile.links.filter((l) => l.label !== "Portfolio generator");
  return (
    <section
      id="top"
      className="container-x flex flex-col justify-center hairline-b"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="py-24 md:py-32">
        <Reveal>
          <p className="mono" style={{ color: "var(--muted)" }}>
            {profile.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="mt-6 font-medium tracking-tight leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            {profile.name}
            <br />
            <span style={{ color: "var(--muted)" }}>{profile.headline}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-base md:text-lg" style={{ color: "var(--muted)" }}>
            {profile.tagline}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <ul className="mt-12 flex flex-wrap gap-8">
            {contact.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="mono link"
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer" : undefined}
                >
                  {l.label} →
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into Landing**

Replace `components/landing/Landing.tsx` with:

```tsx
import { landingSans, landingMono } from "@/lib/landing-fonts";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import "./landing.css";

export function Landing() {
  return (
    <div className={`landing ${landingSans.variable} ${landingMono.variable}`}>
      <Nav />
      <main>
        <Hero />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Type-check and visually verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run dev` in the background, open `http://localhost:3000` in a browser. Expected: black page, sticky nav with mono links, hero headline with the name in white and the statement line in gray, three mono contact links. Stop the dev server afterwards.

- [ ] **Step 5: Commit**

```bash
git add components/landing
git commit -m "Add landing Nav and Hero

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: About and Skills

**Files:**
- Create: `components/landing/About.tsx`
- Create: `components/landing/Skills.tsx`
- Modify: `components/landing/Landing.tsx`

**Interfaces:**
- Consumes: `profile`, `Reveal`, `SectionLabel`.
- Produces: `About()`, `Skills()`.

- [ ] **Step 1: Create About**

Create `components/landing/About.tsx`:

```tsx
import Image from "next/image";
import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function About() {
  return (
    <section id="about" className="hairline-b">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="01" label="About" />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <Reveal className="md:col-span-5" delay={80}>
            <div className="hairline p-2">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={profile.aboutImage.src}
                  alt={profile.aboutImage.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" delay={160}>
            <div className="space-y-6 text-lg md:text-xl leading-relaxed">
              {profile.bio.map((p, i) => (
                <p key={i} style={{ color: i === 0 ? "var(--text)" : "var(--muted)" }}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Skills**

Create `components/landing/Skills.tsx`:

```tsx
import Image from "next/image";
import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function Skills() {
  return (
    <section id="skills" className="hairline-b">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="02" label="Skills" />
        </Reveal>
        <Reveal delay={80}>
          <ul
            className="mt-10 grid grid-cols-3 md:grid-cols-6"
            style={{ borderTop: "1px solid var(--hairline)", borderLeft: "1px solid var(--hairline)" }}
          >
            {profile.skills.map((s) => (
              <li
                key={s.name}
                className="group flex flex-col items-center justify-center gap-4 p-6 aspect-square"
                style={{ borderRight: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}
              >
                <div className="relative h-10 w-10">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="40px"
                    className="object-contain img-mono"
                  />
                </div>
                <span className="mono text-center" style={{ color: "var(--muted)" }}>
                  {s.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into Landing**

In `components/landing/Landing.tsx`, add imports and render after `<Hero />`:

```tsx
import { About } from "./About";
import { Skills } from "./Skills";
```

```tsx
      <main>
        <Hero />
        <About />
        <Skills />
      </main>
```

- [ ] **Step 4: Type-check and visually verify**

Run: `npx tsc --noEmit`
Expected: no output.

Dev server check at `http://localhost:3000/#about`: photo in a hairline frame on the left, bio on the right; skills grid shows 12 grayscale logos that go color on hover, 6 per row on desktop and 3 on mobile width.

- [ ] **Step 5: Commit**

```bash
git add components/landing
git commit -m "Add landing About and Skills sections

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Experience

**Files:**
- Create: `components/landing/Experience.tsx`
- Modify: `components/landing/Landing.tsx`

**Interfaces:**
- Consumes: `profile.experience: Role[]`, `Reveal`, `SectionLabel`.
- Produces: `Experience()`.

- [ ] **Step 1: Create Experience**

Create `components/landing/Experience.tsx`:

```tsx
import Image from "next/image";
import { profile } from "@/content/profile";
import type { Role } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

function Dates({ role }: { role: Role }) {
  const text = role.end ? `${role.start} — ${role.end}` : role.start;
  return (
    <p className={`mono ${role.todo ? "todo" : ""}`} style={role.todo ? undefined : { color: "var(--muted)" }}>
      {text}
    </p>
  );
}

function CompanyMark({ role }: { role: Role }) {
  if (role.logo) {
    return (
      <span className="relative inline-block h-6 w-6 shrink-0 align-middle">
        <Image src={role.logo} alt="" fill sizes="24px" className="object-contain img-mono" />
      </span>
    );
  }
  return (
    <span className="mono hairline inline-flex h-6 items-center px-2 align-middle" style={{ color: "var(--text)" }}>
      {role.company}
    </span>
  );
}

export function Experience() {
  return (
    <section id="experience" className="hairline-b">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="03" label="Experience" />
        </Reveal>
        <ol className="mt-10">
          {profile.experience.map((role, i) => (
            <li key={`${role.company}-${role.role}`} className="hairline-t">
              <Reveal delay={Math.min(i, 4) * 60}>
                <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8">
                  <div className="md:col-span-3">
                    <Dates role={role} />
                  </div>
                  <div className="md:col-span-9">
                    <div className="flex items-center gap-3">
                      <CompanyMark role={role} />
                      <h3 className="text-xl md:text-2xl font-medium tracking-tight">{role.role}</h3>
                    </div>
                    <p className="mt-1 mono" style={{ color: "var(--muted)" }}>
                      {role.company}
                    </p>
                    <ul className="mt-4 space-y-2 max-w-3xl">
                      {role.bullets.map((b, j) => (
                        <li
                          key={j}
                          className={`flex gap-3 text-base leading-relaxed ${role.todo ? "todo mono" : ""}`}
                          style={role.todo ? undefined : { color: "var(--muted)" }}
                        >
                          <span aria-hidden style={{ color: "var(--hairline)" }}>
                            —
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into Landing**

In `components/landing/Landing.tsx`, add `import { Experience } from "./Experience";` and render `<Experience />` after `<Skills />`.

- [ ] **Step 3: Type-check and visually verify**

Run: `npx tsc --noEmit`
Expected: no output.

Dev server check at `http://localhost:3000/#experience`: 9 rows separated by hairlines. The first three rows (Palantir, Amazon, Visa) show a boxed text wordmark and blue `TODO` dates and bullets. Rows 4 to 9 show a 24px grayscale logo and gray bullets.

- [ ] **Step 4: Commit**

```bash
git add components/landing
git commit -m "Add landing Experience section

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Projects and Footer

**Files:**
- Create: `components/landing/Projects.tsx`
- Create: `components/landing/Footer.tsx`
- Modify: `components/landing/Landing.tsx`

**Interfaces:**
- Consumes: `profile.projects: Project[]`, `profile.links`, `Reveal`, `SectionLabel`.
- Produces: `Projects()`, `Footer()`.

- [ ] **Step 1: Create Projects**

Create `components/landing/Projects.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function Projects() {
  return (
    <section id="projects" className="hairline-b">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <SectionLabel number="04" label="Projects" />
        </Reveal>
        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--hairline)" }}>
          {profile.projects.map((p, i) => (
            <li key={p.title} style={{ background: "var(--bg)" }}>
              <Reveal delay={(i % 2) * 80} className="h-full">
                <article className="group flex h-full flex-col">
                  <div className="relative aspect-video w-full hairline-b">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover img-mono"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-medium tracking-tight">{p.title}</h3>
                    <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                      {p.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <li key={t} className="mono hairline px-2 py-1" style={{ color: "var(--muted)" }}>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-auto pt-8 flex gap-6">
                      {p.links.map((l) =>
                        l.href.startsWith("/") ? (
                          <li key={l.label}>
                            <Link href={l.href} className="mono link">
                              {l.label} →
                            </Link>
                          </li>
                        ) : (
                          <li key={l.label}>
                            <a href={l.href} className="mono link" target="_blank" rel="noreferrer">
                              {l.label} ↗
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Footer**

Create `components/landing/Footer.tsx`:

```tsx
import Link from "next/link";
import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="container-x py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <ul className="flex flex-wrap gap-6">
        {profile.links.map((l) =>
          l.external ? (
            <li key={l.label}>
              <a href={l.href} className="mono link" target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.label}>
              <Link href={l.href} className="mono link">
                {l.label}
              </Link>
            </li>
          )
        )}
      </ul>
      <p className="mono" style={{ color: "var(--muted)" }}>
        © {year} {profile.name} · Built with the portfolio generator at{" "}
        <Link href="/submit" className="link">
          /submit
        </Link>
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: Final Landing composition**

Replace `components/landing/Landing.tsx` with:

```tsx
import { landingSans, landingMono } from "@/lib/landing-fonts";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Skills } from "./Skills";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Footer } from "./Footer";
import "./landing.css";

export function Landing() {
  return (
    <div className={`landing ${landingSans.variable} ${landingMono.variable}`}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add components/landing
git commit -m "Add landing Projects and Footer, complete composition

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Full verification

**Files:** none created. Fixes, if any, go in the files above.

- [ ] **Step 1: Run the test suite**

Run: `npx jest`
Expected: all suites pass, including `__tests__/profile.test.ts`. If the pre-existing `theme.test.ts` or `validate.test.ts` fail for reasons unrelated to this work (e.g. missing `jest-environment-jsdom`), note it in the final report but do not fix it here.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds; the route table lists `/`, `/submit`, `/dashboard`, `/dashboard/preview`, `/api/submissions`, `/api/inject-config`. No `Image with src ... is missing required "width"` warnings, no unhandled errors.

- [ ] **Step 3: Browser check**

Run `npm run start` (after build) or `npm run dev` in the background. Using the browser:

1. Open `http://localhost:3000` at 1440px width. Confirm: black background, sticky nav, hero, four labeled sections `01 / ABOUT` through `04 / PROJECTS`, footer. Confirm no horizontal scrollbar.
2. Resize to 375px width. Confirm: nav links scroll horizontally instead of wrapping, skills grid is 3 columns, projects stack to 1 column, no horizontal page scroll.
3. Hover a skill logo and a project image. Confirm they turn from grayscale to color.
4. Open `http://localhost:3000/submit`. Confirm the builder still renders and its live preview still shows the classic template.

Stop the server afterwards.

- [ ] **Step 4: Fix anything found, re-run Steps 1 and 2, and commit**

```bash
git add -A
git commit -m "Verify new landing page build and layout

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Only commit if there were fixes; otherwise skip.
