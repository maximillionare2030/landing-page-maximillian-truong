"use client";

import type { SiteConfig } from "@/types/site";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ExperienceProps {
  config: SiteConfig;
}

export function Experience({ config }: ExperienceProps) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section
      id="experience"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`container space-y-8 py-12 md:py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-3">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent">
          Experience
        </h2>
        <div className="h-1 w-20 bg-accent rounded-full"></div>
      </div>
      <div className="mx-auto grid w-full max-w-5xl gap-6 py-8">
        {config.experience.map((exp, index) => (
          <div
            key={index}
            className="rounded-lg border-2 border-accent bg-card p-6 space-y-4 shadow-md hover:shadow-xl hover:border-accent/80 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="text-2xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
                  {exp.role}
                </h3>
                <p className="text-lg text-foreground transition-colors duration-200">{exp.company}</p>
              </div>
              <p className="text-sm font-medium text-primary px-3 py-1 rounded-full bg-primary/10 hover:bg-accent/10 hover:text-accent transition-all duration-200">
                {exp.start} - {exp.end || "Present"}
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
              {exp.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="leading-relaxed transition-colors duration-200 hover:text-accent pl-2">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

