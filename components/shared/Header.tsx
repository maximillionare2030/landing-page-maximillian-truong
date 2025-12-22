"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/types/site";
import type { VariantId } from "@/lib/variants";
import { variants } from "@/components/variants";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "./ScrollProgress";
import { MagneticElement } from "@/components/ui/MagneticElement";

interface HeaderProps {
  config: SiteConfig;
  variant?: VariantId;
}

export function Header({ config, variant = "classic" }: HeaderProps) {
  const styles = variants[variant].header;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {variant === "classic" && <ScrollProgress />}
      <header
        className={cn(
          styles.root,
          variant === "classic" && "backdrop-blur-sm",
          variant === "classic" && scrolled && "bg-background/80 backdrop-blur-md shadow-sm",
          "transition-all duration-300"
        )}
      >
        <div className="container mx-auto px-4 flex h-14 items-center">
          <div className="mr-4 flex">
            <MagneticElement strength={0.1} disabled={variant !== "classic"}>
              <Link
                href="#"
                className={cn(
                  "mr-6 flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm transition-all hover:text-accent relative group",
                  variant === "classic" && "text-foreground"
                )}
                aria-label="Home"
              >
                <span
                  className={cn(
                    "font-bold transition-colors relative",
                    variant === "classic" ? "text-lg" : "",
                    variant === "classic" && "bg-gradient-to-r from-foreground to-accent bg-clip-text hover:from-accent hover:to-primary"
                  )}
                >
                  {config.name || "Portfolio"}
                </span>
                {variant === "classic" && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                )}
              </Link>
            </MagneticElement>
          </div>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            <MagneticElement strength={0.08} disabled={variant !== "classic"}>
              <Link
                href="#about"
                className={cn(
                  styles.link,
                  variant === "classic" && "relative"
                )}
              >
                About
              </Link>
            </MagneticElement>
            <MagneticElement strength={0.08} disabled={variant !== "classic"}>
              <Link
                href="#skills"
                className={cn(
                  styles.link,
                  variant === "classic" && "relative"
                )}
              >
                Skills
              </Link>
            </MagneticElement>
            <MagneticElement strength={0.08} disabled={variant !== "classic"}>
              <Link
                href="#experience"
                className={cn(
                  styles.link,
                  variant === "classic" && "relative"
                )}
              >
                Experience
              </Link>
            </MagneticElement>
            <MagneticElement strength={0.08} disabled={variant !== "classic"}>
              <Link
                href="#portfolio"
                className={cn(
                  styles.link,
                  variant === "classic" && "relative"
                )}
              >
                Portfolio
              </Link>
            </MagneticElement>
          </nav>
          {config.email && (
            <MagneticElement strength={0.1} disabled={variant !== "classic"}>
              <a
                href={`mailto:${config.email}`}
                className={cn(
                  styles.contact,
                  variant === "classic" && "px-3 py-1 relative overflow-hidden group"
                )}
                aria-label="Contact via email"
              >
                <span className="relative z-10">
                  {variant === "classic" ? config.email : "Contact"}
                </span>
                {variant === "classic" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                )}
              </a>
            </MagneticElement>
          )}
        </div>
      </header>
    </>
  );
}

