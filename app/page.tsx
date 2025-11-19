import { readFile } from "fs/promises";
import { join } from "path";
import { Suspense } from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import { LayoutComponents } from "../app/(public)/submit/components/LayoutComponents";
import type { SiteConfig } from "@/types/site";

async function getConfig(): Promise<SiteConfig> {
  try {
    const configPath = join(process.cwd(), "site.config.json");
    const configFile = await readFile(configPath, "utf-8");
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

async function PageContent() {
  const config = await getConfig();

  return (
    <ThemeProvider config={config}>
      <LayoutComponents layout={config.layout} config={config} />
    </ThemeProvider>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-muted-foreground animate-pulse">Loading...</p>
          </div>
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
}

