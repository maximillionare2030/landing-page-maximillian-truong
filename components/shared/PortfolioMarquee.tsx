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

    return (
      <div
        key={index}
        className="group relative overflow-hidden rounded-xl border-2 border-accent/30 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:border-accent/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[300px] flex flex-col"
      >
        {isValidImage && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={normalizeImagePath(project.image) || project.image}
              alt={project.alt || project.title}
              fill
              sizes="300px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-300"></div>
          </div>
        )}
        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
            {project.description}
          </p>
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

