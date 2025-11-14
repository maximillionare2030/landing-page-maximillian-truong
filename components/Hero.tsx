"use client";

import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface HeroProps {
  config: SiteConfig;
}

export function Hero({ config }: HeroProps) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`container space-y-8 py-12 md:py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        {config.images?.avatar && (
          <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-primary shadow-xl hover:shadow-2xl hover:border-accent transition-all duration-300 hover:scale-105">
            <Image
              src={config.images.avatar}
              alt={`${config.name} avatar`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
              priority
            />
          </div>
        )}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl transition-all duration-300 hover:text-accent">
            {config.headline}
          </h1>
          {config.subheadline && (
            <p className="max-w-[700px] text-foreground md:text-xl leading-relaxed transition-colors duration-300">
              {config.subheadline}
            </p>
          )}
        </div>
        {config.socials && (config.socials.github || config.socials.linkedin || config.socials.website) && (
          <div className="flex gap-6 mt-6">
            {config.socials.github && (
              <a
                href={config.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-3 py-1 hover:bg-accent/10"
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
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-3 py-1 hover:bg-accent/10"
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
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-3 py-1 hover:bg-accent/10"
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

