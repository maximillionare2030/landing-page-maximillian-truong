"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/types/site";
import { normalizeImagePath } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface PortfolioProps {
  config: SiteConfig;
}

export function Portfolio({ config }: PortfolioProps) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section
      id="portfolio"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`container mx-auto px-4 space-y-8 py-8 md:py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent">
          Portfolio
        </h2>
        <div className="h-1 w-20 bg-accent rounded-full"></div>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {config.portfolio.map((project, index) => {
          const normalizedImage = normalizeImagePath(project.image);
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border-2 border-accent bg-card shadow-md hover:shadow-2xl hover:border-accent/80 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 flex flex-col"
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease-out ${index * 100}ms, transform 0.6s ease-out ${index * 100}ms, box-shadow 0.3s ease, border-color 0.3s ease, scale 0.3s ease`
              }}
            >
              {normalizedImage && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={normalizedImage}
                    alt={project.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-300"></div>
                </div>
              )}
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground leading-relaxed transition-colors duration-300">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-muted text-foreground rounded text-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
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
                        className="text-sm text-primary hover:text-accent transition-all duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1 hover:bg-accent/10"
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

