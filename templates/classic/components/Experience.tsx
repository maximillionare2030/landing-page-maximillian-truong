"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/types/site";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface ExperienceProps {
  config: SiteConfig;
}

// Get icon based on role type (fallback if icon not provided)
function getRoleIcon(role: string, customIcon?: string): string {
  if (customIcon) {
    return customIcon;
  }
  const roleLower = role.toLowerCase();
  if (roleLower.includes("intern") || roleLower.includes("internship")) {
    return "🎓";
  } else if (roleLower.includes("lead") || roleLower.includes("senior") || roleLower.includes("principal")) {
    return "🚀";
  } else if (roleLower.includes("engineer") || roleLower.includes("developer")) {
    return "💻";
  } else if (roleLower.includes("manager") || roleLower.includes("director")) {
    return "👔";
  }
  return "💼";
}

export function Experience({ config }: ExperienceProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      config.experience.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, index * 150);
      });
    }
  }, [isVisible, config.experience.length]);

  return (
    <section
      id="experience"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "relative container mx-auto px-4 space-y-12 py-16 md:py-20 lg:py-32 overflow-hidden transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[980px] flex-col items-center gap-4">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text hover:from-primary hover:via-accent hover:to-primary">
          Experience
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Timeline container */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-accent/30 to-primary/30 transform md:-translate-x-1/2"></div>

          <div className="space-y-8">
            {config.experience.map((exp, index) => {
              const isLast = index === config.experience.length - 1;

              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex items-start gap-6 md:gap-8 transition-all duration-700",
                    visibleItems.includes(index)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-card border-4 border-primary/30 flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:border-accent/60 group-hover:scale-110 transition-all duration-300">
                      {getRoleIcon(exp.role, exp.icon)}
                    </div>
                    {!isLast && (
                      <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary/30 to-accent/30"></div>
                    )}
                  </div>

                  {/* Experience card */}
                  <div
                    className={cn(
                      "group relative flex-1 rounded-xl border-2 border-accent/30 bg-card/80 backdrop-blur-sm p-6 md:p-8 shadow-lg transition-all duration-500",
                      "hover:shadow-2xl hover:border-accent/60 hover:scale-[1.02] hover:-translate-y-2",
                      "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/0 before:via-accent/0 before:to-primary/0 before:opacity-0 before:transition-opacity before:duration-300",
                      "hover:before:opacity-10"
                    )}
                  >
                    {/* Gradient border effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-accent/0 to-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10"></div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent mb-2">
                          {exp.role}
                        </h3>
                        <p className="text-base md:text-lg text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium text-primary group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:text-accent transition-all duration-200">
                          <span className="w-2 h-2 rounded-full bg-primary group-hover:bg-accent animate-pulse"></span>
                          <span>{exp.start} - {exp.end || "Present"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bullet points */}
                    <ul className="space-y-3">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="relative pl-6 text-sm md:text-base text-foreground leading-relaxed transition-all duration-200 group-hover:text-foreground/90"
                        >
                          {/* Custom bullet marker */}
                          <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-accent transition-colors duration-200"></div>
                          <div className="absolute left-0.5 top-1.5 w-0.5 h-0.5 rounded-full bg-primary group-hover:bg-accent transition-colors duration-200"></div>
                          <span className="relative">{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Decorative corner elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-xl"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
