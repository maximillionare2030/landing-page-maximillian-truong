"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { normalizeImagePath } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { SectionDivider } from "./SectionDivider";

interface AboutProps {
  config: SiteConfig;
  variant?: VariantId;
}

// Typing animation hook
function useTypingAnimation(text: string, isVisible: boolean, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
      }
    };

    // Small delay before starting
    timeoutRef.current = setTimeout(typeNextChar, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isVisible, speed]);

  return { displayedText, isTyping };
}

export function About({ config, variant = "classic" }: AboutProps) {
  const normalizedImage = normalizeImagePath(config.about.image);
  const { elementRef, isVisible } = useScrollAnimation();
  const styles = variants[variant].about;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);

  // Typing animation for bio text
  const { displayedText, isTyping } = useTypingAnimation(
    config.about.bio,
    isVisible,
    20
  );

  return (
    <>
      {variant === "classic" && <SectionDivider type="wave" flip={false} />}
      <section
        id="about"
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
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
          </div>
        )}

        <div className={cn(
          "mx-auto flex max-w-[1200px] flex-col items-center gap-4 mb-12 transition-all duration-700",
          variant === "classic" && "relative z-10",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        )}>
          <h2 className={cn(
            styles.title,
            variant === "classic" && "text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent animate-gradient-shift"
          )}>
            About
          </h2>
          {styles.divider && (
            <div className={cn(
              "relative w-16 h-1 transition-all duration-700",
              isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )}
            style={{ transitionDelay: "200ms" }}
            >
              <div className={cn(
                styles.divider,
                "w-full h-full bg-gradient-to-r from-transparent via-accent to-transparent"
              )}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
            </div>
          )}
        </div>
        <div className={cn(
          "mx-auto grid w-full max-w-6xl items-start gap-12 py-8 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]",
          variant === "classic" && "relative z-10"
        )}>
          {normalizedImage && (
            <div
              className={cn(
                "flex justify-center md:justify-start transition-all duration-700",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <div
                className="relative w-full max-w-[280px] lg:max-w-[320px] group"
                onMouseEnter={() => setImageHovered(true)}
                onMouseLeave={() => setImageHovered(false)}
              >
                <div className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-full border-4 transition-all duration-500 shadow-2xl",
                  "border-border group-hover:border-accent/50",
                  imageHovered && "scale-105 shadow-accent/20"
                )}>
                  <Image
                    src={normalizedImage}
                    alt={config.about.alt || "About image"}
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    className={cn(
                      "object-cover object-center transition-all duration-700",
                      imageHovered && "scale-110 brightness-110"
                    )}
                    priority
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className={cn(
                    "absolute inset-0 rounded-full ring-4 transition-all duration-500",
                    "ring-background/50 group-hover:ring-accent/30"
                  )}></div>
                  {/* Animated gradient overlay on hover */}
                  <div className={cn(
                    "absolute inset-0 rounded-full bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0",
                    "transition-all duration-500",
                    imageHovered && "from-primary/10 via-accent/10 to-primary/10"
                  )}></div>
                  {/* Glow effect */}
                  <div className={cn(
                    "absolute -inset-2 rounded-full bg-accent/0 blur-xl transition-all duration-500",
                    imageHovered && "bg-accent/20"
                  )}></div>
                </div>
                {/* Floating particles effect on hover */}
                {imageHovered && (
                  <>
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-accent rounded-full animate-pulse opacity-75"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-primary rounded-full animate-pulse opacity-75" style={{ animationDelay: "0.3s" }}></div>
                    <div className="absolute top-1/2 -left-3 w-2.5 h-2.5 bg-accent/60 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                  </>
                )}
              </div>
            </div>
          )}
          <div className={cn(
            "flex flex-col gap-6 transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}
          style={{ transitionDelay: "400ms" }}
          >
            <div className="prose prose-invert max-w-none">
              <p className={cn(
                styles.bio,
                variant === "classic" && "text-base md:text-lg leading-7 md:leading-8 text-muted-foreground"
              )}>
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 md:h-6 bg-accent ml-1 animate-pulse" />
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      {variant === "classic" && <SectionDivider type="wave" flip={true} />}
    </>
  );
}

