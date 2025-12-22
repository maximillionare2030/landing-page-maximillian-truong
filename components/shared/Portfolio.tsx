"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { normalizeImagePath } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { SectionDivider } from "./SectionDivider";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

interface PortfolioProps {
  config: SiteConfig;
  variant?: VariantId;
}

export function Portfolio({ config, variant = "classic" }: PortfolioProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const styles = variants[variant].portfolio;

  const openLightbox = (image: string) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <>
      {variant === "classic" && <SectionDivider type="dots" />}
      <section
        id="portfolio"
        ref={variant === "classic" ? (elementRef as React.RefObject<HTMLElement>) : undefined}
        className={cn(
          styles.root,
          variant === "classic" && "transition-all duration-1000 relative",
          variant === "classic" && (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")
        )}
      >
        {/* Background effects */}
        {variant === "classic" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }}></div>
          </div>
        )}

        <div className={cn("mx-auto flex max-w-[1200px] flex-col items-center gap-3", variant === "classic" && "relative z-10")}>
          <h2 className={cn(
            styles.title,
            variant === "classic" && "animate-slide-in-down"
          )}>
            Portfolio
          </h2>
          {styles.divider && (
            <div className={cn(
              styles.divider,
              variant === "classic" && "animate-scale-in"
            )}></div>
          )}
        </div>
        <div className={cn(
          styles.grid,
          variant === "classic" && "relative z-10"
        )}>
          {config.portfolio.map((project, index) => {
            const normalizedImage = normalizeImagePath(project.image);
            return (
              <AnimatedCard
                key={index}
                className={cn(
                  styles.card,
                  "group overflow-hidden"
                )}
                glowColor={index % 3 === 0 ? "primary" : index % 3 === 1 ? "accent" : "both"}
                intensity="medium"
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease-out ${index * 100}ms, transform 0.6s ease-out ${index * 100}ms`,
                }}
              >
                {normalizedImage && (
                  <div
                    className={cn(
                      styles.image,
                      "relative overflow-hidden cursor-pointer"
                    )}
                    onClick={() => openLightbox(normalizedImage)}
                  >
                    <Image
                      src={normalizedImage}
                      alt={project.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={cn(
                        "object-cover transition-transform duration-700",
                        "group-hover:scale-110"
                      )}
                    />
                    {/* Hover overlay with project info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {project.description}
                      </p>
                    </div>
                    {/* Click indicator */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className={cn(
                  "p-6 space-y-3 flex-1 flex flex-col",
                  normalizedImage && "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                )}>
                  <h3 className={cn(
                    styles.projectTitle,
                    "group-hover:scale-105 transition-transform duration-200"
                  )}>
                    {project.title}
                  </h3>
                  <p className={cn(
                    styles.description,
                    "group-hover:text-foreground transition-colors duration-200"
                  )}>
                    {project.description}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <div className={cn(
                      styles.tags,
                      "animate-fade-in"
                    )}>
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={cn(
                            styles.tag,
                            "group-hover:scale-105 group-hover:bg-accent/20 transition-all duration-200"
                          )}
                          style={{ animationDelay: `${tagIndex * 50}ms` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.links && project.links.length > 0 && (
                    <div className={cn(
                      "flex gap-2",
                      "mt-4"
                    )}>
                      {project.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            styles.link,
                            "group-hover:scale-105 group-hover:bg-accent/10 transition-all duration-200"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImage}
              alt="Portfolio project"
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
      {variant === "classic" && <SectionDivider type="dots" />}
    </>
  );
}

