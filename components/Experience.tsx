"use client";

import type { SiteConfig } from "@/types/site";

interface ExperienceProps {
  config: SiteConfig;
}

export function Experience({ config }: ExperienceProps) {
  return (
    <section id="experience" className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Experience
        </h2>
      </div>
      <div className="mx-auto grid w-full max-w-5xl gap-6 py-6">
        {config.experience.map((exp, index) => (
          <div
            key={index}
            className="rounded-lg border p-6 space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="text-2xl font-semibold">{exp.role}</h3>
                <p className="text-lg text-muted-foreground">{exp.company}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {exp.start} - {exp.end || "Present"}
              </p>
            </div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
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

