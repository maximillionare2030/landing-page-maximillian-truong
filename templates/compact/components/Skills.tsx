"use client";

import type { SiteConfig } from "@/types/site";

interface SkillsProps {
  config: SiteConfig;
}

export function Skills({ config }: SkillsProps) {
  return (
    <section id="skills" className="container space-y-4 py-4 md:py-6 lg:py-8">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-1">
        <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
          Skills
        </h2>
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-2 py-4 justify-center">
        {config.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full border text-sm"
          >
            {skill.name}
            {skill.level && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({skill.level})
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
