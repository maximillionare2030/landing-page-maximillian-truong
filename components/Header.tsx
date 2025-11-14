"use client";

import Link from "next/link";
import type { SiteConfig } from "@/types/site";

interface HeaderProps {
  config: SiteConfig;
}

export function Header({ config }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link
            href="#"
            className="mr-6 flex items-center space-x-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm transition-all hover:text-accent"
            aria-label="Home"
          >
            <span className="font-bold text-lg transition-colors">{config.name || "Portfolio"}</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="#about"
            className="text-foreground/80 transition-all duration-200 hover:text-accent hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
          >
            About
          </Link>
          <Link
            href="#skills"
            className="text-foreground/80 transition-all duration-200 hover:text-accent hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
          >
            Skills
          </Link>
          <Link
            href="#experience"
            className="text-foreground/80 transition-all duration-200 hover:text-accent hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
          >
            Experience
          </Link>
          <Link
            href="#portfolio"
            className="text-foreground/80 transition-all duration-200 hover:text-accent hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
          >
            Portfolio
          </Link>
        </nav>
        {config.email && (
          <a
            href={`mailto:${config.email}`}
            className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label="Contact via email"
          >
            Contact
          </a>
        )}
      </div>
    </header>
  );
}

