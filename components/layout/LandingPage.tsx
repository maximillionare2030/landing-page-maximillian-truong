"use client";

import type { SiteConfig } from "@/types/site";
import { Header } from "@/components/shared/Header";
import { Hero } from "@/components/shared/Hero";
import { About } from "@/components/shared/About";
import { SkillsMarquee } from "@/components/shared/SkillsMarquee";
import { Experience } from "@/components/shared/Experience";
import { PortfolioMarquee } from "@/components/shared/PortfolioMarquee";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";

interface LandingPageProps {
  config: SiteConfig;
}

export function LandingPage({ config }: LandingPageProps) {
  const variant = "classic";

  return (
    <div className="min-h-screen flex flex-col relative">
      {variant === "classic" && (
        <AnimatedBackground
          showShapes={true}
          showGradient={true}
          showGrid={true}
          className="fixed inset-0 -z-10"
        />
      )}
      <Header config={config} variant={variant} />
      <main className="flex-1 relative z-0">
        <Hero config={config} variant={variant} />
        <About config={config} variant={variant} />
        <SkillsMarquee config={config} variant={variant} />
        <Experience config={config} variant={variant} />
        <PortfolioMarquee config={config} variant={variant} />
      </main>
    </div>
  );
}

