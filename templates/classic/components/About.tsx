"use client";

import Image from "next/image";
import type { SiteConfig } from "@/types/site";

interface AboutProps {
  config: SiteConfig;
}

export function About({ config }: AboutProps) {
  return (
    <section id="about" className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          About
        </h2>
      </div>
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 py-6 md:grid-cols-2 md:gap-12">
        {config.about.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={config.about.image}
              alt={config.about.alt || "About image"}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {config.about.bio}
          </p>
        </div>
      </div>
    </section>
  );
}

