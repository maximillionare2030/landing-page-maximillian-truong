"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { normalizeImagePath } from "@/lib/utils";
import { Marquee } from "@/components/ui/Marquee";
import { SectionDivider } from "./SectionDivider";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface PortfolioMarqueeProps {
  config: SiteConfig;
  variant?: VariantId;
}

export function PortfolioMarquee({ config, variant = "classic" }: PortfolioMarqueeProps) {
  const styles = variants[variant].hero;
  const showMarquees = variant === "classic";
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });

  // Make visible after mount for preview contexts
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If not visible after 500ms, make it visible (for preview/initial render)
    const timeout = setTimeout(() => {
      if (!isVisible && elementRef.current) {
        // Force visibility for preview contexts
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [elementRef, isVisible]);

  // Show if visible or after mount delay (for preview contexts)
  const shouldShow = isVisible || mounted;

  // Create portfolio cards for marquee (classic only)
  const portfolioCards = showMarquees ? config.portfolio.map((project, index) => {
    const isValidImage = project.image &&
      project.image !== "uploaded" &&
      project.image.trim() !== "" &&
      (project.image.startsWith("data:") ||
       project.image.startsWith("http://") ||
       project.image.startsWith("https://") ||
       project.image.startsWith("/"));

    const normalizedImage = isValidImage ? normalizeImagePath(project.image) || project.image : null;

    return (
      <div
        key={index}
        className="group relative overflow-hidden rounded-xl border-2 border-accent/30 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:border-accent/60 transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2 min-w-[320px] max-w-[320px] flex flex-col"
      >
        {normalizedImage && (
          <div className="relative aspect-video w-full overflow-hidden h-[180px]">
            <Image
              src={normalizedImage}
              alt={project.alt || project.title}
              fill
              sizes="320px"
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold text-foreground mb-1 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
                {project.description}
              </p>
            </div>
          </div>
        )}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-foreground transition-all duration-300 group-hover:text-accent transform group-hover:translate-x-1">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2 group-hover:text-foreground/90 transition-colors duration-300">
              {project.description}
            </p>
          </div>

          {/* Links section - above tags */}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
              {project.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-primary hover:text-accent bg-primary/10 hover:bg-accent/20 border border-primary/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-sm transform translate-y-0 group-hover:translate-y-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{link.label}</span>
                  <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {/* Tags at the bottom */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {project.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-muted/80 text-foreground/80 rounded-md text-xs font-medium transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-accent/20 group-hover:text-accent group-hover:border-accent/30 border border-transparent transform translate-y-0 group-hover:translate-y-0"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }) : [];

  if (!showMarquees || !config.portfolio || config.portfolio.length === 0) {
    return null;
  }

  return (
    <>
      <SectionDivider type="dots" />
      <section
        id="portfolio"
        ref={variant === "classic" ? (elementRef as React.RefObject<HTMLElement>) : undefined}
        className={cn(
          "relative container mx-auto px-4 overflow-hidden transition-all duration-700",
          shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className={styles.marqueeContainer}>
          <div className={cn(
            "flex items-center justify-center gap-4 transition-all duration-700",
            shouldShow ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
          style={{ transitionDelay: "200ms" }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <h2 className={cn(
              styles.marqueeTitle,
              "text-2xl font-semibold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent animate-gradient-shift"
            )}>Portfolio</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
          <div className={cn(
            "relative transition-all duration-700",
            shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "400ms" }}
          >
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            <Marquee
              items={portfolioCards}
              speed={80}
              pauseOnHover={true}
              direction="right"
              gap={24}
              className="py-4"
            />
          </div>
        </div>
      </section>
      <SectionDivider type="dots" />
    </>
  );
}

