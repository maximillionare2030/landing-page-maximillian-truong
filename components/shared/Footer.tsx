"use client";

import Link from "next/link";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { cn } from "@/lib/utils";
import { MagneticElement } from "@/components/ui/MagneticElement";

interface FooterProps {
  config: SiteConfig;
  variant?: VariantId;
}

export function Footer({ config, variant = "classic" }: FooterProps) {
  const styles = variants[variant].footer;

  return (
    <footer className={cn(styles.root, "relative overflow-hidden")}>
      {/* Background pattern */}
      {variant === "classic" && (
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      )}

      <div className={cn(styles.content, "relative z-10")}>
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} {config.name}. All rights reserved.
            </p>
          </div>
          {config.socials && (
            <div className={cn("flex", variant === "classic" ? "gap-6" : "gap-4")}>
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
                    aria-label="GitHub"
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
                    aria-label="LinkedIn"
                  >
                    <span className="relative z-10">LinkedIn</span>
                    {variant === "classic" && (
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                    )}
                  </a>
                </MagneticElement>
              )}
              {config.email && (
                <MagneticElement strength={0.15} disabled={variant !== "classic"}>
                  <a
                    href={`mailto:${config.email}`}
                    className={cn(
                      styles.socialLink,
                      variant === "classic" && "relative overflow-hidden group"
                    )}
                    aria-label="Email"
                  >
                    <span className="relative z-10">
                      {variant === "classic" ? config.email : config.email}
                    </span>
                    {variant === "classic" && (
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                    )}
                  </a>
                </MagneticElement>
              )}
            </div>
          )}
        </div>
      </div>
      {variant === "classic" && styles.cta && (
        <div className={cn(styles.cta, "relative z-10")}>
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col items-center gap-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text hover:from-accent hover:via-primary hover:to-accent transition-all duration-300">
                  Want a Page like this?
                </h3>
                <p className="text-muted-foreground">Generate one automatically and I'll deploy it for you.</p>
              </div>
              <MagneticElement strength={0.2}>
                <Link
                  href="/submit"
                  className="relative px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden group"
                >
                  <span className="relative z-10">Try it Here!</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </MagneticElement>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

