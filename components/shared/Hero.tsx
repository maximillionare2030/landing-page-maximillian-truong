"use client";

import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { normalizeImagePath } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./AnimatedBackground";
import { GradientBorder } from "./GradientBorder";
import { MagneticElement } from "@/components/ui/MagneticElement";
import { ParallaxContainer } from "./ParallaxContainer";

interface HeroProps {
  config: SiteConfig;
  variant?: VariantId;
}

export function Hero({ config, variant = "classic" }: HeroProps) {
  const normalizedAvatar = normalizeImagePath(config.images?.avatar);
  const { elementRef, isVisible } = useScrollAnimation();
  const styles = variants[variant].hero;
  const heroBackgroundStyle = config.theme?.heroBackgroundStyle || "default";

  // Blur effects (ParallaxContainer blur divs) - shown for all background styles except when explicitly disabled
  const blurEffects = (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <ParallaxContainer speed={0.3} direction="up">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
      </ParallaxContainer>
      <ParallaxContainer speed={0.2} direction="down">
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
      </ParallaxContainer>
      <ParallaxContainer speed={0.15}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl"></div>
      </ParallaxContainer>
    </div>
  );

  return (
    <section
      ref={variant === "classic" ? (elementRef as React.RefObject<HTMLElement>) : undefined}
      className={cn(
        styles.root,
        variant === "classic" && "transition-all duration-1000",
        variant === "classic" && (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")
      )}
    >
      {/* Enhanced animated background (classic only) */}
      {variant === "classic" && (
        <>
          {heroBackgroundStyle === "blur-only" && blurEffects}
          {heroBackgroundStyle === "gradient-border" && (
            <>
              {blurEffects}
              <GradientBorder />
            </>
          )}
          {heroBackgroundStyle === "minimal-grid" && (
            <>
              <AnimatedBackground showShapes={false} showGradient={false} showGrid={true} minimalGrid={true} />
              {blurEffects}
            </>
          )}
          {(heroBackgroundStyle === "default" || !heroBackgroundStyle) && (
            <>
              <AnimatedBackground showShapes={false} showGradient={true} showGrid={true} />
              {blurEffects}
            </>
          )}
        </>
      )}

      {/* Main hero content */}
      <div className={cn("flex flex-col items-center gap-8 text-center", variant === "classic" && "relative z-10")}>
        {/* Enhanced 3D Avatar with magnetic effect */}
        {normalizedAvatar && (
          <MagneticElement strength={0.2} disabled={variant !== "classic"}>
            <div className={cn(styles.avatar || "", "group")}>
              {variant === "classic" ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse-glow"></div>
                  <div
                    className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-primary shadow-2xl hover:shadow-primary/50 hover:border-accent transition-all duration-300 hover:scale-105 perspective-1000"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <Image
                      src={normalizedAvatar}
                      alt={`${config.name} avatar`}
                      fill
                      sizes="(max-width: 768px) 128px, 160px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      priority
                    />
                    {/* 3D depth effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </>
              ) : (
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary">
                  <Image
                    src={normalizedAvatar}
                    alt={`${config.name} avatar`}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </MagneticElement>
        )}

        {/* Enhanced Headline with gradient animation */}
        {variant === "classic" ? (
          <ParallaxContainer speed={0.1}>
            <div className={cn("flex flex-col items-center gap-4")}>
              <h1 className={cn(styles.headline, "gradient-text")}>
                {config.headline}
              </h1>
              {config.subheadline && (
                <p className={cn(styles.subheadline, "animate-fade-in")}>
                  {config.subheadline}
                </p>
              )}
            </div>
          </ParallaxContainer>
        ) : (
          <div className={cn("flex flex-col items-center gap-2")}>
            <h1 className={styles.headline}>
              {config.headline}
            </h1>
            {config.subheadline && (
              <p className={styles.subheadline}>
                {config.subheadline}
              </p>
            )}
          </div>
        )}

        {/* Enhanced Social links with magnetic effect */}
        {config.socials && (config.socials.github || config.socials.linkedin || config.socials.website) && (
          <div className={cn("flex gap-6 mt-4", variant === "classic" ? "" : "gap-4")}>
            {config.socials.github && (
              <MagneticElement strength={0.15} disabled={variant !== "classic"}>
                <a
                  href={config.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    styles.socialLink,
                    variant === "classic" && "relative overflow-hidden group"
                  )}
                  aria-label="GitHub profile"
                >
                  <span className="relative z-10">GitHub</span>
                  {variant === "classic" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                  )}
                </a>
              </MagneticElement>
            )}
            {config.socials.linkedin && (
              <MagneticElement strength={0.15} disabled={variant !== "classic"}>
                <a
                  href={config.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    styles.socialLink,
                    variant === "classic" && "relative overflow-hidden group"
                  )}
                  aria-label="LinkedIn profile"
                >
                  <span className="relative z-10">LinkedIn</span>
                  {variant === "classic" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                  )}
                </a>
              </MagneticElement>
            )}
            {config.socials.website && (
              <MagneticElement strength={0.15} disabled={variant !== "classic"}>
                <a
                  href={config.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    styles.socialLink,
                    variant === "classic" && "relative overflow-hidden group"
                  )}
                  aria-label="Personal website"
                >
                  <span className="relative z-10">Website</span>
                  {variant === "classic" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                  )}
                </a>
              </MagneticElement>
            )}
          </div>
        )}
      </div>

    </section>
  );
}

