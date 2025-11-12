import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { SiteConfig } from "@/types/site";

const sampleConfig: SiteConfig = {
  name: "Jane Doe",
  headline: "Senior Software Engineer",
  subheadline: "Building amazing products with code",
  email: "jane@example.com",
  socials: {
    github: "https://github.com/janedoe",
    linkedin: "https://linkedin.com/in/janedoe",
    website: "https://janedoe.dev",
  },
  theme: {
    id: "noir",
    brandHex: "#6b7280",
    darkMode: true,
  },
  layout: "classic",
  images: {
    avatar: "/uploads/avatar.jpg",
  },
  about: {
    bio: "I'm a passionate software engineer with 5+ years of experience building web applications. I love solving complex problems and creating beautiful user experiences that make a difference.",
    image: "/uploads/about.jpg",
    alt: "Jane Doe working at her desk",
  },
  skills: [
    { name: "JavaScript", level: "advanced" },
    { name: "TypeScript", level: "advanced" },
    { name: "React", level: "advanced" },
    { name: "Next.js", level: "intermediate" },
    { name: "Node.js", level: "intermediate" },
    { name: "Python", level: "beginner" },
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Tech Corp",
      start: "Jan 2020",
      end: "Present",
      bullets: [
        "Led development of customer-facing web applications serving 100K+ users",
        "Mentored junior developers and conducted code reviews",
        "Improved application performance by 40% through optimization",
        "Collaborated with cross-functional teams to deliver features on time",
      ],
    },
    {
      role: "Software Engineer",
      company: "StartupXYZ",
      start: "Jun 2018",
      end: "Dec 2019",
      bullets: [
        "Built and maintained React-based frontend applications",
        "Implemented RESTful APIs using Node.js and Express",
        "Participated in agile development processes",
      ],
    },
  ],
  portfolio: [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.",
      image: "/uploads/project1.jpg",
      alt: "E-commerce platform dashboard showing product listings",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      links: [
        { label: "Live Demo", url: "https://ecommerce-demo.example.com" },
        { label: "GitHub", url: "https://github.com/janedoe/ecommerce" },
      ],
    },
    {
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "/uploads/project2.jpg",
      alt: "Task management app interface",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
      links: [
        { label: "Live Demo", url: "https://tasks-demo.example.com" },
        { label: "GitHub", url: "https://github.com/janedoe/tasks" },
      ],
    },
    {
      title: "Weather Dashboard",
      description:
        "A beautiful weather dashboard that displays current conditions and forecasts for multiple locations with interactive maps.",
      image: "/uploads/project3.jpg",
      alt: "Weather dashboard showing forecast data",
      tags: ["React", "D3.js", "Weather API"],
      links: [
        { label: "Live Demo", url: "https://weather-demo.example.com" },
      ],
    },
  ],
};

const outputDir = join(process.cwd(), "submissions", "sample");
mkdirSync(outputDir, { recursive: true });

const configPath = join(outputDir, "config.json");
writeFileSync(configPath, JSON.stringify(sampleConfig, null, 2), "utf-8");

console.log("✅ Sample config created at:", configPath);
console.log("\n📋 Sample data includes:");
console.log("   - Personal information");
console.log("   - 6 skills with different levels");
console.log("   - 2 work experiences");
console.log("   - 3 portfolio projects");
console.log("\n💡 You can use this config for testing the form and CLI tool.");

