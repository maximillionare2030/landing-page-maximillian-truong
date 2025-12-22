"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { normalizeImagePath } from "@/lib/utils";
import { Marquee } from "@/components/ui/Marquee";
import { cn } from "@/lib/utils";
import { SectionDivider } from "./SectionDivider";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SkillsMarqueeProps {
  config: SiteConfig;
  variant?: VariantId;
}

export function SkillsMarquee({ config, variant = "classic" }: SkillsMarqueeProps) {
  const styles = variants[variant].hero;
  const showMarquees = variant === "classic";
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });

  // Make visible after mount for preview contexts
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If not visible after 500ms, make it visible (for preview/initial render)
    const timeout = setTimeout(() => {
      if (!isVisible && elementRef.current) {
        // Force visibility for preview contexts
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [elementRef, isVisible]);

  // Show if visible or after mount delay (for preview contexts)
  const shouldShow = isVisible || mounted;

  // Create skill cards for marquee (classic only)
  const skillCards = showMarquees ? config.skills.map((skill, index) => {
    const getLevelColor = (level?: string) => {
      switch (level) {
        case "advanced":
          return "bg-primary/20 text-primary border-primary/30";
        case "intermediate":
          return "bg-accent/20 text-accent border-accent/30";
        default:
          return "bg-muted text-foreground border-border";
      }
    };

    const isValidImage = skill.image &&
      skill.image !== "uploaded" &&
      skill.image.trim() !== "" &&
      (skill.image.startsWith("data:") ||
       skill.image.startsWith("http://") ||
       skill.image.startsWith("https://") ||
       skill.image.startsWith("/"));

    return (
      <div
        key={index}
        className="group relative flex flex-col items-center justify-center rounded-xl border-2 bg-card/80 backdrop-blur-sm p-6 min-w-[200px] shadow-lg hover:shadow-xl hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-scale-in"
        style={{
          animationDelay: `${index * 50}ms`,
        }}
      >
        {isValidImage && skill.image && (
          <div className="relative w-12 h-12 mb-2 rounded-lg overflow-hidden border-2 border-primary/30 group-hover:border-accent/50 transition-all duration-300 group-hover:rotate-6">
            <Image
              src={normalizeImagePath(skill.image) || skill.image}
              alt={skill.name}
              fill
              sizes="48px"
              className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 text-foreground transition-colors duration-200 group-hover:text-accent">
          {skill.name}
        </h3>
        {skill.level && (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide transition-all duration-200 border group-hover:scale-110 group-hover:animate-pulse-glow",
              getLevelColor(skill.level)
            )}
          >
            {skill.level}
          </span>
        )}
      </div>
    );
  }) : [];

  if (!showMarquees || !config.skills || config.skills.length === 0) {
    return null;
  }

  return (
    <>
      <SectionDivider type="geometric" flip={false} />
      <section
        id="skills"
        ref={variant === "classic" ? (elementRef as React.RefObject<HTMLElement>) : undefined}
        className={cn(
          "relative container mx-auto px-4 overflow-hidden transition-all duration-700",
          shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className={styles.marqueeContainer}>
          <div className={cn(
            "flex items-center justify-center gap-4 transition-all duration-700",
            shouldShow ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
          style={{ transitionDelay: "200ms" }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <h2 className={cn(
              styles.marqueeTitle,
              "text-2xl font-semibold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent animate-gradient-shift"
            )}>Skills</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
          </div>
          <div className={cn(
            "relative transition-all duration-700",
            shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "400ms" }}
          >
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            <Marquee
              items={skillCards}
              speed={60}
              pauseOnHover={true}
              direction="left"
              gap={24}
              className="py-4"
            />
          </div>
        </div>
      </section>
      <SectionDivider type="geometric" flip={true} />
    </>
  );
}

