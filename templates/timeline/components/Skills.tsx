"use client";

import type { SiteConfig } from "@/types/site";

interface SkillsProps {
  config: SiteConfig;
}

export function Skills({ config }: SkillsProps) {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case "advanced":
        return "bg-primary text-primary-foreground";
      case "intermediate":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="skills" className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Skills
        </h2>
      </div>
      <div className="mx-auto grid w-full max-w-5xl gap-4 py-6 md:grid-cols-2 lg:grid-cols-3">
        {config.skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-accent p-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
            {skill.level && (
              <span
                className={`px-3 py-1 rounded-full text-sm ${getLevelColor(skill.level)}`}
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

