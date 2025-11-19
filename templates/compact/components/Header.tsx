"use client";

import Link from "next/link";
import type { SiteConfig } from "@/types/site";

interface HeaderProps {
  config: SiteConfig;
}

export function Header({ config }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center">
        <div className="mr-4 flex">
          <Link
            href="#"
            className="mr-6 flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Home"
          >
            <span className="font-bold">{config.name}</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="#about"
            className="transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            About
          </Link>
          <Link
            href="#skills"
            className="transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Skills
          </Link>
          <Link
            href="#experience"
            className="transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Experience
          </Link>
          <Link
            href="#portfolio"
            className="transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Portfolio
          </Link>
        </nav>
        {config.email && (
          <a
            href={`mailto:${config.email}`}
            className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Contact via email"
          >
            Contact
          </a>
        )}
      </div>
    </header>
  );
}

