"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/types/site";
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
      className={`container space-y-8 py-12 md:py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-3">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent">
          Portfolio
        </h2>
        <div className="h-1 w-20 bg-accent rounded-full"></div>
      </div>
      <div className="mx-auto grid w-full max-w-5xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {config.portfolio.map((project, index) => {
          // Validate image URL before rendering
          const isValidImage = project.image &&
            project.image !== "uploaded" &&
            project.image.trim() !== "" &&
            (project.image.startsWith("data:") ||
             project.image.startsWith("http://") ||
             project.image.startsWith("https://") ||
             project.image.startsWith("/"));

          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border-2 border-accent bg-card shadow-md hover:shadow-2xl hover:border-accent/80 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 flex flex-col"
            >
              {isValidImage && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={project.image}
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
                <p className="text-sm text-foreground leading-relaxed flex-1 transition-colors duration-200">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-muted text-foreground rounded-full text-xs font-medium border border-transparent hover:border-accent hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.links && project.links.length > 0 && (
                  <div className="flex gap-4 mt-4">
                    {project.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm transition-all duration-200 hover:scale-105 flex items-center gap-1 group/link"
                      >
                        <span>{link.label}</span>
                        <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
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

