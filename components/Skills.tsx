"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { normalizeImagePath } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SkillsProps {
  config: SiteConfig;
}

export function Skills({ config }: SkillsProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Staggered reveal animation
      config.skills.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, index * 100);
      });
    }
  }, [isVisible, config.skills.length]);

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "advanced":
        return "bg-primary/20 text-primary border-primary/30 shadow-lg shadow-primary/20";
      case "intermediate":
        return "bg-accent/20 text-accent border-accent/30 shadow-lg shadow-accent/20";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <section
      id="skills"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "relative container space-y-12 py-16 md:py-20 lg:py-32 overflow-hidden transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[980px] flex-col items-center gap-4">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text hover:from-accent hover:via-primary hover:to-accent">
          Skills
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"></div>
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {config.skills.map((skill, index) => (
          <div
            key={index}
            className={cn(
              "group relative flex flex-col items-center justify-center rounded-xl border-2 bg-card/80 backdrop-blur-sm p-6 text-center shadow-lg transition-all duration-500",
              "hover:shadow-2xl hover:border-accent/60 hover:scale-105 hover:-translate-y-2",
              "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/0 before:via-accent/0 before:to-primary/0 before:opacity-0 before:transition-opacity before:duration-300",
              "hover:before:opacity-10",
              visibleItems.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            {skill.image && (
              <div className="relative w-16 h-16 mb-3 rounded-lg overflow-hidden border-2 border-primary/30 group-hover:border-accent/50 transition-all duration-300">
                <Image
                  src={normalizeImagePath(skill.image) || skill.image}
                  alt={skill.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            )}
            <h3 className="relative text-xl font-semibold mb-3 text-foreground transition-colors duration-200 group-hover:text-accent">
              {skill.name}
            </h3>
            {skill.level && (
              <span
                className={cn(
                  "relative px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide transition-all duration-200 border",
                  "group-hover:scale-110 group-hover:shadow-lg",
                  getLevelColor(skill.level)
                )}
              >
                {skill.level}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

