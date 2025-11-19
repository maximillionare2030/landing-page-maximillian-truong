"use client";

import type { SiteConfig } from "@/types/site";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SkillsProps {
  config: SiteConfig;
}

export function Skills({ config }: SkillsProps) {
  const { elementRef, isVisible } = useScrollAnimation();

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "advanced":
        return "bg-primary text-primary-foreground shadow-lg shadow-primary/20";
      case "intermediate":
        return "bg-accent text-accent-foreground shadow-lg shadow-accent/20";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <section
      id="skills"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`container mx-auto px-4 space-y-8 py-8 md:py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent">
          Skills
        </h2>
        <div className="h-1 w-20 bg-accent rounded-full"></div>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-4 py-8 md:grid-cols-2 lg:grid-cols-3">
        {config.skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-accent bg-card p-6 text-center shadow-md hover:shadow-xl hover:border-accent/80 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{
              animationDelay: `${index * 100}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s ease-out ${index * 100}ms, transform 0.6s ease-out ${index * 100}ms`
            }}
          >
            <h3 className="text-xl font-semibold mb-3 text-foreground transition-colors duration-200 hover:text-accent">
              {skill.name}
            </h3>
            {skill.level && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide transition-all duration-200 hover:scale-110 ${getLevelColor(skill.level)}`}
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

