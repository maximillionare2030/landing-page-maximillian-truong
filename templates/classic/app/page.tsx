import { readFileSync } from "fs";
import { join } from "path";
import { LandingPage } from "@/components/layout/LandingPage";
import type { SiteConfig } from "@/types/site";

function getConfig(): SiteConfig {
  try {
    const configPath = join(process.cwd(), "site.config.json");
    const configFile = readFileSync(configPath, "utf-8");
    return JSON.parse(configFile) as SiteConfig;
  } catch (error) {
    // Fallback config if file doesn't exist
    return {
      name: "Your Name",
      headline: "Your Headline",
      theme: { id: "noir", darkMode: true },
      layout: "classic",
      about: { bio: "Your bio here" },
      skills: [],
      experience: [],
      portfolio: [],
    };
  }
}

export default function HomePage() {
  const config = getConfig();

  return <LandingPage config={config} />;
}

