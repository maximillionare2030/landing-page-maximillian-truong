"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { SectionDivider } from "./SectionDivider";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { normalizeImagePath } from "@/lib/utils";

interface ExperienceProps {
  config: SiteConfig;
  variant?: VariantId;
}

// Get icon based on role type (fallback if icon not provided)
function getRoleIcon(role: string, customIcon?: string): string | null {
  if (customIcon === "none" || customIcon === null) {
    return null;
  }
  if (customIcon && customIcon !== "auto") {
    // If it's an emoji or URL, return it
    return customIcon;
  }
  const roleLower = role.toLowerCase();
  if (roleLower.includes("intern") || roleLower.includes("internship")) {
    return "🎓";
  } else if (roleLower.includes("lead") || roleLower.includes("senior") || roleLower.includes("principal")) {
    return "🚀";
  } else if (roleLower.includes("engineer") || roleLower.includes("developer")) {
    return "💻";
  } else if (roleLower.includes("manager") || roleLower.includes("director")) {
    return "👔";
  }
  return "💼";
}

// Check if a string is a URL or data URL (image)
function isImageUrl(str: string): boolean {
  return (
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.startsWith("data:") ||
    str.startsWith("/") ||
    str.startsWith("assets/")
  );
}

export function Experience({ config, variant = "classic" }: ExperienceProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const styles = variants[variant].experience;

  useEffect(() => {
    if (variant === "classic" && isVisible) {
      config.experience.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, index * 150);
      });

      // Animate timeline line drawing
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setTimelineProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [isVisible, config.experience.length, variant]);

  return (
    <>
      {variant === "classic" && <SectionDivider type="diagonal" flip={false} />}
      <section
        id="experience"
        ref={variant === "classic" ? (elementRef as React.RefObject<HTMLElement>) : undefined}
        className={cn(
          styles.root,
          variant === "classic" && "transition-all duration-1000 relative",
          variant === "classic" && (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")
        )}
      >
        {/* Enhanced decorative background elements (classic only) */}
        {variant === "classic" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
          </div>
        )}

        <div className={cn(
          "mx-auto flex max-w-[980px] flex-col items-center gap-4",
          "relative z-10"
        )}>
          <h2 className={cn(
            styles.title,
            variant === "classic" && "animate-slide-in-down"
          )}>
            Experience
          </h2>
          {styles.divider && (
            <div className={cn(
              styles.divider,
              variant === "classic" && "animate-scale-in"
            )}></div>
          )}
        </div>

      <div className={cn(styles.container, "relative z-10")}>
        {/* Enhanced classic variant with animated timeline */}
        <div className="relative" ref={timelineRef}>
            {/* Animated timeline line */}
            <div className={cn(styles.timelineLine, "relative")}>
              <div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-accent to-primary transition-all duration-1000 ease-out"
                style={{
                  height: `${timelineProgress}%`,
                  transform: variant === "classic" ? "translateX(-50%)" : undefined,
                }}
              />
            </div>
            <div className="space-y-8">
              {config.experience.map((exp, index) => {
                const isLast = index === config.experience.length - 1;
                const isVisible = visibleItems.includes(index);
                return (
                  <div
                    key={index}
                    className={cn(
                      styles.item,
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    )}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="relative z-10 flex-shrink-0">
                      {/* Enhanced 3D timeline dot */}
                      <AnimatedCard
                        className={cn(
                          styles.dot,
                          "group relative perspective-1000"
                        )}
                        glowColor={index % 2 === 0 ? "primary" : "accent"}
                        intensity="high"
                      >
                        <div
                          className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full"
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          {(() => {
                            // Check if exp.icon is a valid image (similar to Skills component)
                            // Accept: data URLs, http/https URLs, paths starting with /, or assets/ paths
                            const isValidImage = exp.icon &&
                              exp.icon !== "uploaded" &&
                              exp.icon !== "none" &&
                              exp.icon.trim() !== "" &&
                              (exp.icon.startsWith("data:") ||
                               exp.icon.startsWith("http://") ||
                               exp.icon.startsWith("https://") ||
                               exp.icon.startsWith("/") ||
                               exp.icon.startsWith("assets/"));

                            if (isValidImage && exp.icon) {
                              // Normalize the path (handles assets/ -> /assets/ and other conversions)
                              // Use exact same pattern as Skills component
                              const normalizedImage = normalizeImagePath(exp.icon) || exp.icon;

                              // Use regular img tag for data URLs and external URLs (Next.js Image doesn't handle these well)
                              const isDataUrl = normalizedImage.startsWith("data:");
                              const isExternalUrl = normalizedImage.startsWith("http://") || normalizedImage.startsWith("https://");

                              if (isDataUrl || isExternalUrl) {
                                return (
                                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
                                    <img
                                      src={normalizedImage}
                                      alt={`${exp.company} logo`}
                                      className="w-full h-full object-cover object-center rounded-full transition-transform duration-300 group-hover:scale-110"
                                    />
                                  </div>
                                );
                              }

                              // Use Next.js Image component for local paths (exact same pattern as Skills component)
                              // Match Skills: use explicit dimensions in a container div
                              return (
                                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
                                  <Image
                                    src={normalizedImage}
                                    alt={`${exp.company} logo`}
                                    fill
                                    sizes="(max-width: 768px) 64px, 80px"
                                    className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                                  />
                                </div>
                              );
                            }

                            // Fall back to getRoleIcon for emoji icons or auto-detection
                            const icon = getRoleIcon(exp.role, exp.icon);
                            if (!icon) {
                              // No icon - show company initial
                              return (
                                <div className="text-xl md:text-2xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">
                                  {exp.company.charAt(0).toUpperCase()}
                                </div>
                              );
                            } else if (isImageUrl(icon)) {
                              // Image URL from getRoleIcon (fallback case)
                              const normalizedImage = normalizeImagePath(icon);
                              if (!normalizedImage) {
                                return (
                                  <div className="text-xl md:text-2xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">
                                    {exp.company.charAt(0).toUpperCase()}
                                  </div>
                                );
                              }
                              const isDataUrl = normalizedImage.startsWith("data:");
                              const isExternalUrl = normalizedImage.startsWith("http://") || normalizedImage.startsWith("https://");
                              if (isDataUrl || isExternalUrl) {
                                return (
                                  <img
                                    src={normalizedImage}
                                    alt={`${exp.company} logo`}
                                    className="absolute inset-0 w-full h-full object-cover object-center rounded-full transition-transform duration-300 group-hover:scale-110"
                                  />
                                );
                              }
                              return (
                                <div className="relative w-full h-full rounded-full overflow-hidden">
                                  <Image
                                    src={normalizedImage}
                                    alt={`${exp.company} logo`}
                                    fill
                                    sizes="(max-width: 768px) 48px, 64px"
                                    className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                                  />
                                </div>
                              );
                            } else {
                              // Emoji icon
                              return (
                                <div className="text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                  {icon}
                                </div>
                              );
                            }
                          })()}
                          {/* Glow ring */}
                          <div className="absolute inset-0 rounded-full border-2 border-primary/30 group-hover:border-accent/50 transition-all duration-300 group-hover:scale-110"></div>
                        </div>
                      </AnimatedCard>
                      {!isLast && (
                        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary/30 to-accent/30 animate-pulse-glow"></div>
                      )}
                    </div>
                    <AnimatedCard
                      className={cn(styles.card, "group")}
                      glowColor={index % 2 === 0 ? "primary" : "accent"}
                      intensity="medium"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-accent/0 to-primary/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"></div>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className={cn(
                            styles.role,
                            "group-hover:scale-105 transition-transform duration-200"
                          )}>
                            {exp.role}
                          </h3>
                          <p className={cn(
                            styles.company,
                            "group-hover:translate-x-1 transition-transform duration-200"
                          )}>
                            {exp.company}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className={cn(
                            styles.date,
                            "group-hover:scale-105 transition-transform duration-200"
                          )}>
                            <span className="w-2 h-2 rounded-full bg-primary group-hover:bg-accent animate-pulse-glow"></span>
                            <span>{exp.start} - {exp.end || "Present"}</span>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className={cn(
                              styles.bullet,
                              "group-hover:translate-x-2 transition-transform duration-200"
                            )}
                            style={{ transitionDelay: `${bulletIndex * 50}ms` }}
                          >
                            <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-accent transition-colors duration-200 group-hover:scale-125"></div>
                            <div className="absolute left-0.5 top-1.5 w-0.5 h-0.5 rounded-full bg-primary group-hover:bg-accent transition-colors duration-200"></div>
                            <span className="relative">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-xl group-hover:scale-110"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-xl group-hover:scale-110"></div>
                    </AnimatedCard>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
      </section>
      {variant === "classic" && <SectionDivider type="diagonal" flip={true} />}
    </>
  );
}

