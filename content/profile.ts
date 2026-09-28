export type ProfileLink = {
  label: string;
  href: string;
  external: boolean;
  todo?: boolean;
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
  eyebrow: "Incoming Palantir, Engineering @ UC Irvine",
  headline: "Software Engineer",
  tagline:
    "Full-Stack, Applied AI, Distributed Systems",
  bio: [
    "Hi! My name is Max and I'm a current third-year Computer Engineering student at the University of California, Irvine, pursuing a minor in Digital Information Systems.",
    "In my free time, I enjoy working on personal projects with my friends and exploring different genres of Software Engineering, like Embedded Systems, which has allowed me to become a well-rounded engineer.",
  ],
  aboutImage: { src: `/uploads/about-${B}.PNG`, alt: "Max Truong" },
  links: [
    { label: "Email", href: "mailto:maxtrinh4@gmail.com", external: false },
    { label: "GitHub", href: "https://github.com/maximillionare2030", external: true },
    { label: "LinkedIn", href: "https://linkedin.com/in/mtruong4", external: true },
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
      role: "Incoming Forward Deployed Engineer",
      company: "Palantir",
      start: "Jun 2027",
      end: "Sep 2027",
      bullets: ["2027 USG Defense Tech"],
      logo: "/uploads/logo-palantir.png",
    },
    {
      role: "Software Development Engineer Intern",
      company: "Amazon",
      start: "Aug 2026",
      end: "Dec 2026",
      bullets: ["Alexa+ LLM Infra"],
      logo: "/uploads/logo-amazon.png",
    },
    {
      role: "Software Engineering Intern",
      company: "Visa",
      start: "Jun 2026",
      end: "Aug 2026",
      bullets: ["Core Tokenization Systems"],
      logo: "/uploads/logo-visa.png",
    },
    {
      role: "Software Engineering & Product Management Intern",
      company: "L3Harris Technologies",
      start: "Jun 2024",
      end: "May 2026",
      bullets: [
        "Naval GPS Systems",
      ],
      logo: "/uploads/logo-l3harris.png",
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
