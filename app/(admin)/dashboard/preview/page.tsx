"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getThemeTokens, tokensToCSS } from "@/lib/themes";
import type { SiteConfig, ThemeId } from "@/types/site";
import { LandingPage } from "@/components/layout/LandingPage";
import { ArrowLeft } from "lucide-react";

export default function PreviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("noir");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/dashboard");
      return;
    }

    // Load config and assets from sessionStorage
    const savedConfig = sessionStorage.getItem("preview-config");
    const savedAssets = sessionStorage.getItem("preview-assets");

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig) as SiteConfig;
        let processedConfig = { ...parsed };

        // If assets are available, convert assets/ paths to data URLs
        if (savedAssets) {
          try {
            const assetsDataUrls = JSON.parse(savedAssets) as Record<string, string>;

            // Helper function to convert assets/ paths to data URLs
            const convertAssetPath = (path: string | undefined | null): string | undefined => {
              if (!path || typeof path !== "string") return undefined;

              // Check if path starts with assets/
              if (path.startsWith("assets/")) {
                const filename = path.replace("assets/", "");
                const dataUrl = assetsDataUrls[filename];
                if (dataUrl) {
                  return dataUrl;
                }
              }

              return path;
            };

            // Convert about image
            if (processedConfig.about?.image) {
              processedConfig.about.image = convertAssetPath(processedConfig.about.image) || processedConfig.about.image;
            }

            // Convert portfolio images
            if (processedConfig.portfolio) {
              processedConfig.portfolio = processedConfig.portfolio.map((project) => ({
                ...project,
                image: convertAssetPath(project.image) || project.image,
              }));
            }

            // Convert skill images
            if (processedConfig.skills) {
              processedConfig.skills = processedConfig.skills.map((skill) => ({
                ...skill,
                image: convertAssetPath(skill.image) || skill.image,
              }));
            }

            // Convert experience icons
            if (processedConfig.experience) {
              processedConfig.experience = processedConfig.experience.map((exp) => ({
                ...exp,
                icon: convertAssetPath(exp.icon) || exp.icon,
              }));
            }

            // Convert avatar and hero images
            if (processedConfig.images?.avatar) {
              processedConfig.images.avatar = convertAssetPath(processedConfig.images.avatar) || processedConfig.images.avatar;
            }
            if (processedConfig.images?.hero) {
              processedConfig.images.hero = convertAssetPath(processedConfig.images.hero) || processedConfig.images.hero;
            }

            // Convert favicon
            if (processedConfig.favicon) {
              processedConfig.favicon = convertAssetPath(processedConfig.favicon) || processedConfig.favicon;
            }
          } catch (error) {
            console.error("Failed to parse assets data URLs:", error);
          }
        }

        setConfig(processedConfig);
        setSelectedTheme(processedConfig.theme.id);
      } catch (error) {
        console.error("Failed to load preview config:", error);
      }
    }
  }, [status, router]);

  if (status === "loading" || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading preview...</p>
      </div>
    );
  }

  // Update config with selected theme for preview (always use classic layout)
  const previewConfig: SiteConfig = {
    ...config,
    theme: {
      ...config.theme,
      id: selectedTheme,
    },
    layout: "classic",
  };

  const themeTokens = getThemeTokens(
    selectedTheme,
    config.theme.brandHex,
    config.theme.primaryHex,
    config.theme.accentHex,
    config.theme.backgroundHex
  );
  const themeCSS = tokensToCSS(themeTokens);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-semibold">Live Preview</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedTheme}
              onValueChange={(value) => setSelectedTheme(value as ThemeId)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noir">Noir</SelectItem>
                <SelectItem value="neon-noir">Neon Noir</SelectItem>
                <SelectItem value="slate-pop">Slate Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          ${themeCSS}
        }
      `}</style>

      {/* Render actual template components */}
      <LandingPage config={previewConfig} />
    </div>
  );
}

