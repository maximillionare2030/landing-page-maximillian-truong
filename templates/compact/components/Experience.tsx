"use client";

import type { SiteConfig } from "@/types/site";

interface ExperienceProps {
  config: SiteConfig;
}

export function Experience({ config }: ExperienceProps) {
  return (
    <section id="experience" className="container space-y-4 py-4 md:py-6 lg:py-8">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-1">
        <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
          Experience
        </h2>
      </div>
      <div className="mx-auto grid w-full max-w-5xl gap-3 py-4 md:grid-cols-2">
        {config.experience.map((exp, index) => (
          <div
            key={index}
            className="rounded-lg border p-4 space-y-2"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{exp.role}</h3>
              <p className="text-sm text-muted-foreground">{exp.company}</p>
              <p className="text-xs text-muted-foreground">
                {exp.start} - {exp.end || "Present"}
              </p>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-sm text-muted-foreground">
              {exp.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

