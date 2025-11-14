"use client";

import Image from "next/image";
import type { SiteConfig } from "@/types/site";

interface HeroProps {
  config: SiteConfig;
}

export function Hero({ config }: HeroProps) {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="flex flex-col items-center gap-4 text-center">
        {config.images?.avatar && (
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary">
            <Image
              src={config.images.avatar}
              alt={`${config.name} avatar`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            {config.headline}
          </h1>
          {config.subheadline && (
            <p className="max-w-[700px] text-foreground md:text-xl">
              {config.subheadline}
            </p>
          )}
        </div>
        {config.socials && (
          <div className="flex gap-4 mt-4">
            {config.socials.github && (
              <a
                href={config.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="GitHub profile"
              >
                GitHub
              </a>
            )}
            {config.socials.linkedin && (
              <a
                href={config.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="LinkedIn profile"
              >
                LinkedIn
              </a>
            )}
            {config.socials.website && (
              <a
                href={config.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Personal website"
              >
                Website
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

