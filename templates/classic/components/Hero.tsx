"use client";

import Image from "next/image";
import type { SiteConfig } from "@/types/site";
import { normalizeImagePath } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Marquee } from "@/components/ui/Marquee";
import { cn } from "@/lib/utils";

interface HeroProps {
  config: SiteConfig;
}

export function Hero({ config }: HeroProps) {
  const normalizedAvatar = normalizeImagePath(config.images?.avatar);
  const { elementRef, isVisible } = useScrollAnimation();

  // Create skill cards for marquee
  const skillCards = config.skills.map((skill, index) => {
    const getLevelColor = (level?: string) => {
      switch (level) {
        case "advanced":
          return "bg-primary/20 text-primary border-primary/30";
        case "intermediate":
          return "bg-accent/20 text-accent border-accent/30";
        default:
          return "bg-muted text-foreground border-border";
      }
    };

    const isValidImage = skill.image &&
      skill.image !== "uploaded" &&
      skill.image.trim() !== "" &&
      (skill.image.startsWith("data:") ||
       skill.image.startsWith("http://") ||
       skill.image.startsWith("https://") ||
       skill.image.startsWith("/"));

    return (
      <div
        key={index}
        className="group relative flex flex-col items-center justify-center rounded-xl border-2 bg-card/80 backdrop-blur-sm p-6 min-w-[200px] shadow-lg hover:shadow-xl hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      >
        {isValidImage && (
          <div className="relative w-12 h-12 mb-2 rounded-lg overflow-hidden border-2 border-primary/30 group-hover:border-accent/50 transition-all duration-300">
            <Image
              src={normalizeImagePath(skill.image) || skill.image}
              alt={skill.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 text-foreground transition-colors duration-200 group-hover:text-accent">
          {skill.name}
        </h3>
        {skill.level && (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide transition-all duration-200 border",
              getLevelColor(skill.level)
            )}
          >
            {skill.level}
          </span>
        )}
      </div>
    );
  });

  // Create portfolio cards for marquee
  const portfolioCards = config.portfolio.map((project, index) => {
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
  });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "relative container mx-auto px-4 space-y-12 py-16 md:py-20 lg:py-32 overflow-hidden transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      {/* Floating decorative graphics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Main hero content with layered cards */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Avatar with enhanced styling */}
        {normalizedAvatar && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-primary shadow-2xl hover:shadow-primary/50 hover:border-accent transition-all duration-300 hover:scale-105">
              <Image
                src={normalizedAvatar}
                alt={`${config.name} avatar`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
                priority
              />
            </div>
          </div>
        )}

        {/* Headline with gradient text effect */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl transition-all duration-300 hover:text-accent bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text hover:from-accent hover:via-primary hover:to-accent">
            {config.headline}
          </h1>
          {config.subheadline && (
            <p className="max-w-[700px] text-foreground md:text-xl leading-relaxed transition-colors duration-300">
              {config.subheadline}
            </p>
          )}
        </div>

        {/* Social links with enhanced styling */}
        {config.socials && (config.socials.github || config.socials.linkedin || config.socials.website) && (
          <div className="flex gap-6 mt-4">
            {config.socials.github && (
              <a
                href={config.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg hover:bg-accent/10 border border-transparent hover:border-accent/30"
                aria-label="GitHub profile"
              >
                GitHub
              </a>
            )}
            {config.socials.linkedin && (
              <a
                href={config.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg hover:bg-accent/10 border border-transparent hover:border-accent/30"
                aria-label="LinkedIn profile"
              >
                LinkedIn
              </a>
            )}
            {config.socials.website && (
              <a
                href={config.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg hover:bg-accent/10 border border-transparent hover:border-accent/30"
                aria-label="Personal website"
              >
                Website
              </a>
            )}
          </div>
        )}
      </div>

      {/* Skills Marquee Section */}
      {config.skills.length > 0 && (
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <h2 className="text-2xl font-semibold text-foreground px-4">Skills</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            <Marquee
              items={skillCards}
              speed={60}
              pauseOnHover={true}
              direction="left"
              gap={24}
              className="py-4"
            />
          </div>
        </div>
      )}

      {/* Portfolio Marquee Section */}
      {config.portfolio.length > 0 && (
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <h2 className="text-2xl font-semibold text-foreground px-4">Portfolio</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
          <div className="relative">
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
      )}
    </section>
  );
}

