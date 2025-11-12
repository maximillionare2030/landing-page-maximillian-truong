"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getThemeTokens, tokensToCSS } from "@/lib/themes";
import type { SiteConfig, ThemeId, LayoutId } from "@/types/site";
import { ArrowLeft } from "lucide-react";

// This is a simplified preview - in production, you'd import the actual template components
export default function PreviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("noir");
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>("classic");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/dashboard");
      return;
    }

    // Load config from sessionStorage
    const savedConfig = sessionStorage.getItem("preview-config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        setSelectedTheme(parsed.theme.id);
        setSelectedLayout(parsed.layout);
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

  const themeTokens = getThemeTokens(
    selectedTheme,
    config.theme.brandHex,
    config.theme.darkMode ?? true
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
            <Select
              value={selectedLayout}
              onValueChange={(value) => setSelectedLayout(value as LayoutId)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <style jsx global>{`
          :root {
            ${themeCSS}
          }
        `}</style>

        {/* Preview Content - This would render the actual template components */}
        <Card>
          <CardHeader>
            <CardTitle>Preview: {config.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">{config.headline}</h2>
                {config.subheadline && (
                  <p className="text-muted-foreground">{config.subheadline}</p>
                )}
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <p>{config.about.bio}</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {config.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Experience</h3>
                <div className="space-y-4">
                  {config.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 pl-4">
                      <h4 className="font-semibold">{exp.role}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.start} - {exp.end || "Present"}
                      </p>
                      <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {config.portfolio.map((project, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

