"use client";

import Link from "next/link";
import type { SiteConfig } from "@/types/site";

interface FooterProps {
  config: SiteConfig;
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} {config.name}. All rights reserved.
            </p>
          </div>
          {config.socials && (
            <div className="flex gap-6">
              {config.socials.github && (
                <a
                  href={config.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1 hover:bg-accent/10"
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
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1 hover:bg-accent/10"
                  aria-label="LinkedIn"
                >
                  LinkedIn
                </a>
              )}
              {config.email && (
                <a
                  href={`mailto:${config.email}`}
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1 hover:bg-accent/10"
                  aria-label="Email"
                >
                  {config.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Want a Page like this?</h3>
              <p className="text-muted-foreground">Generate one automatically and I'll deploy it for you.</p>
            </div>
            <Link
              href="/submit"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Try it Here!
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

