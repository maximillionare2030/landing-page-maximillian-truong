"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/types/site";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { normalizeImagePath } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PortfolioProps {
  config: SiteConfig;
}

export function Portfolio({ config }: PortfolioProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Staggered reveal animation
      config.portfolio.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, index * 150);
      });
    }
  }, [isVisible, config.portfolio.length]);

  return (
    <section
      id="portfolio"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "relative container space-y-12 py-16 md:py-20 lg:py-32 overflow-hidden transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[980px] flex-col items-center gap-4">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl transition-colors duration-300 hover:text-accent bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text hover:from-primary hover:via-accent hover:to-primary">
          Portfolio
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 py-8 md:grid-cols-2 lg:grid-cols-3">
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
              className={cn(
                "group relative overflow-hidden rounded-xl border-2 border-accent/30 bg-card/80 backdrop-blur-sm shadow-lg flex flex-col transition-all duration-500",
                "hover:shadow-2xl hover:border-accent/60 hover:scale-105 hover:-translate-y-2",
                "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/0 before:via-accent/0 before:to-primary/0 before:opacity-0 before:transition-opacity before:duration-300",
                "hover:before:opacity-10",
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 z-0"></div>
              {isValidImage && (
                <div className="relative aspect-video w-full overflow-hidden z-10">
                  <Image
                    src={normalizeImagePath(project.image) || project.image}
                    alt={project.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-300"></div>
                </div>
              )}
              <div className="relative p-6 space-y-3 flex-1 flex flex-col z-10">
                <h3 className="text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 transition-colors duration-200">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-muted/50 text-foreground rounded-full text-xs font-medium border border-border/50 hover:border-accent/50 hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-105"
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

