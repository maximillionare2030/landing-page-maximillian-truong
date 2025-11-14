"use client";

import type { SiteConfig } from "@/types/site";

interface FooterProps {
  config: SiteConfig;
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="border-t-2 border-accent bg-card py-8 md:py-0 transition-all duration-300">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left transition-colors duration-200 hover:text-foreground">
            © {new Date().getFullYear()} {config.name || "Portfolio"}. All rights reserved.
          </p>
        </div>
        {config.socials && (config.socials.github || config.socials.linkedin || config.email) && (
          <div className="flex gap-6">
            {config.socials.github && (
              <a
                href={config.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-3 py-1 hover:bg-accent/10"
                aria-label="GitHub"
              >
                GitHub
              </a>
            )}
            {config.socials.linkedin && (
              <a
                href={config.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-3 py-1 hover:bg-accent/10"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
            )}
            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-3 py-1 hover:bg-accent/10"
                aria-label="Email"
              >
                Email
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}

