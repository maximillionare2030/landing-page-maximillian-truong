import { readFileSync } from "fs";
import { join } from "path";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Experience } from "../components/Experience";
import { Portfolio } from "../components/Portfolio";
import { Footer } from "../components/Footer";
import type { SiteConfig } from "@/types/site";

function getConfig(): SiteConfig {
  try {
    const configPath = join(process.cwd(), "site.config.json");
    const configFile = readFileSync(configPath, "utf-8");
    return JSON.parse(configFile) as SiteConfig;
  } catch (error) {
    return {
      name: "Your Name",
      headline: "Your Headline",
      theme: { id: "noir", darkMode: true },
      layout: "timeline",
      about: { bio: "Your bio here" },
      skills: [],
      experience: [],
      portfolio: [],
    };
  }
}

export default function HomePage() {
  const config = getConfig();

  return (
    <div className="min-h-screen flex flex-col">
      <Header config={config} />
      <main className="flex-1">
        <Hero config={config} />
        <About config={config} />
        <Skills config={config} />
        <Experience config={config} />
        <Portfolio config={config} />
      </main>
      <Footer config={config} />
    </div>
  );
}

