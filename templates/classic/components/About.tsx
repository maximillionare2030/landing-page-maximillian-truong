"use client";

import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import { normalizeImagePath } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AboutProps {
  config: SiteConfig;
}

export function About({ config }: AboutProps) {
  const normalizedImage = normalizeImagePath(config.about.image);
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section
      id="about"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`container mx-auto px-4 space-y-8 py-8 md:py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent">
          About
        </h2>
        <div className="h-1 w-20 bg-accent rounded-full"></div>
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 py-8 md:grid-cols-2 md:gap-12">
        {normalizedImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-accent shadow-xl hover:shadow-2xl hover:border-accent/80 transition-all duration-300 hover:scale-[1.02] group">
            <Image
              src={normalizedImage}
              alt={config.about.alt || "About image"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all duration-300"></div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <p className="text-lg text-foreground leading-relaxed transition-colors duration-300">
            {config.about.bio}
          </p>
        </div>
      </div>
    </section>
  );
}

