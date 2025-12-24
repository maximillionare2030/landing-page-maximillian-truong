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
              <div
                key={index}
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                  transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`,
                }}
              >
                <AnimatedCard
                  className={cn(
                    styles.card,
                    "group overflow-hidden"
                  )}
                  glowColor={index % 3 === 0 ? "primary" : index % 3 === 1 ? "accent" : "both"}
                  intensity="medium"
                >
                {normalizedImage && (
                  <div
                    className={cn(
                      styles.image,
                      "relative overflow-hidden cursor-pointer aspect-video h-[240px]"
                    )}
                    onClick={() => openLightbox(normalizedImage)}
                  >
                    <Image
                      src={normalizedImage}
                      alt={project.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={cn(
                        "object-cover transition-all duration-700 ease-out",
                        "group-hover:scale-110 group-hover:brightness-110"
                      )}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {/* Hover overlay with project info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
                        {project.description}
                      </p>
                    </div>
                    {/* Click indicator with animation */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 shadow-lg border border-accent/20">
                      <svg className="w-5 h-5 text-accent transform group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className={cn(
                  "p-6 space-y-4 flex-1 flex flex-col",
                  !normalizedImage && "min-h-[200px]"
                )}>
                  <div className="flex-1 space-y-3">
                    <h3 className={cn(
                      styles.projectTitle,
                      "group-hover:text-accent transition-all duration-300 transform group-hover:translate-x-1"
                    )}>
                      {project.title}
                    </h3>
                    <p className={cn(
                      styles.description,
                      "group-hover:text-foreground/90 transition-colors duration-300 line-clamp-3"
                    )}>
                      {project.description}
                    </p>
                  </div>

                  {/* Links section - above tags */}
                  {project.links && project.links.length > 0 && (
                    <div className={cn(
                      "flex flex-wrap gap-2 pt-2 border-t border-border/50",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 100 + 200}ms` }}
                    >
                      {project.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                            "text-sm font-medium text-primary hover:text-accent",
                            "bg-primary/10 hover:bg-accent/20 border border-primary/20 hover:border-accent/40",
                            "transition-all duration-300 hover:scale-105 hover:shadow-md",
                            "group-hover:translate-y-0 transform translate-y-1"
                          )}
                          style={{ transitionDelay: `${linkIndex * 50}ms` }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{link.label}</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tags at the bottom */}
                  {project.tags && project.tags.length > 0 && (
                    <div className={cn(
                      styles.tags,
                      "mt-auto pt-3"
                    )}
                    style={{ animationDelay: `${index * 100 + 300}ms` }}
                    >
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={cn(
                            styles.tag,
                            "transform transition-all duration-300 ease-out",
                            "group-hover:scale-105 group-hover:bg-accent/20 group-hover:text-accent",
                            "group-hover:border-accent/30 border border-transparent",
                            "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                          )}
                          style={{
                            animationDelay: `${index * 100 + 300 + tagIndex * 30}ms`,
                            transitionDelay: `${tagIndex * 30}ms`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                </AnimatedCard>
              </div>
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

