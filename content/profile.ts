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
    { label: "LinkedIn", href: "https://www.linkedin.com/in/TODO_LINKEDIN_URL", external: true, todo: true },
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
