"use client";

import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { normalizeImagePath } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SectionDivider } from "./SectionDivider";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

interface SkillsProps {
  config: SiteConfig;
  variant?: VariantId;
}

export function Skills({ config, variant = "classic" }: SkillsProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const styles = variants[variant].skills;

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "advanced":
        return "bg-primary text-primary-foreground shadow-lg shadow-primary/20";
      case "intermediate":
        return "bg-accent text-accent-foreground shadow-lg shadow-accent/20";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <>
      {variant === "classic" && <SectionDivider type="geometric" flip={false} />}
      <section
        id="skills"
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
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
          </div>
        )}

        <div className={cn("mx-auto flex max-w-[1200px] flex-col items-center gap-3", variant === "classic" && "relative z-10")}>
          <h2 className={cn(
            styles.title,
            variant === "classic" && "animate-slide-in-down"
          )}>
            Skills
          </h2>
          {styles.divider && (
            <div className={cn(
              styles.divider,
              variant === "classic" && "animate-scale-in"
            )}></div>
          )}
        </div>
        <div className={cn(styles.grid, "relative z-10")}>
          {config.skills.map((skill, index) => {
            const isValidImage = skill.image &&
              skill.image !== "uploaded" &&
              skill.image.trim() !== "" &&
              (skill.image.startsWith("data:") ||
               skill.image.startsWith("http://") ||
               skill.image.startsWith("https://") ||
               skill.image.startsWith("/") ||
               skill.image.startsWith("assets/"));

            return (
              <AnimatedCard
                key={index}
                className={cn(
                  styles.card,
                  "group"
                )}
                glowColor={skill.level === "advanced" ? "primary" : skill.level === "intermediate" ? "accent" : "both"}
                intensity="medium"
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease-out ${index * 100}ms, transform 0.6s ease-out ${index * 100}ms`,
                }}
              >
                {isValidImage && (
                  <div className="relative w-16 h-16 mb-4 mx-auto rounded-lg overflow-hidden border-2 border-primary/30 group-hover:border-accent/50 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Image
                      src={normalizeImagePath(skill.image) || skill.image || "/placeholder.png"}
                      alt={skill.name}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}
                <h3 className={cn(
                  styles.skillName,
                  "group-hover:scale-105 transition-transform duration-200"
                )}>
                  {skill.name}
                </h3>
                {skill.level && (
                  <span className={cn(
                    styles.levelBadge,
                    getLevelColor(skill.level),
                    "group-hover:scale-110 group-hover:animate-pulse-glow transition-all duration-200"
                  )}>
                    {skill.level}
                  </span>
                )}
              </AnimatedCard>
            );
          })}
        </div>
      </section>
      {variant === "classic" && <SectionDivider type="geometric" flip={true} />}
    </>
  );
}

