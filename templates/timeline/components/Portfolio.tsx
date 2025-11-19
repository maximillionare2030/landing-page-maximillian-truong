"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/types/site";
import { normalizeImagePath } from "@/lib/utils";

interface PortfolioProps {
  config: SiteConfig;
}

export function Portfolio({ config }: PortfolioProps) {
  return (
    <section id="portfolio" className="container mx-auto px-4 space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Portfolio
        </h2>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-6 py-6 md:grid-cols-2 lg:grid-cols-3">
        {config.portfolio.map((project, index) => {
          const normalizedImage = normalizeImagePath(project.image);
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border-2 border-accent"
            >
              {normalizedImage && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={normalizedImage}
                    alt={project.alt || project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-foreground">
                {project.description}
              </p>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-muted text-foreground rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {project.links && project.links.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {project.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}

