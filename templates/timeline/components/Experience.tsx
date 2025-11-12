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
      <div className="mx-auto w-full max-w-5xl py-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {config.experience.map((exp, index) => (
              <div key={index} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-6 top-2 h-4 w-4 rounded-full bg-primary border-4 border-background" />

                <div className="rounded-lg border p-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-2xl font-semibold">{exp.role}</h3>
                      <p className="text-lg text-muted-foreground">{exp.company}</p>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      {exp.start} - {exp.end || "Present"}
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

