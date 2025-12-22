"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GradientBorderProps {
  className?: string;
}

export function GradientBorder({ className }: GradientBorderProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setIsReducedMotion(prefersReducedMotion);
  }, []);

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Main gradient with smooth fade to transparent at edges */}
      <div
        className="w-full h-full relative"
        style={{
          background: isReducedMotion
            ? "linear-gradient(to right, transparent 0%, hsl(var(--primary) / 0.3) 15%, hsl(var(--primary)) 25%, hsl(var(--accent)) 50%, hsl(var(--primary)) 75%, hsl(var(--primary) / 0.3) 85%, transparent 100%)"
            : "linear-gradient(to right, transparent 0%, hsl(var(--primary) / 0.3) 15%, hsl(var(--primary)) 25%, hsl(var(--accent)) 50%, hsl(var(--primary)) 75%, hsl(var(--primary) / 0.3) 85%, transparent 100%)",
          backgroundSize: isReducedMotion ? "100% 100%" : "200% 100%",
          animation: isReducedMotion ? "none" : "gradient-border 3s ease-in-out infinite",
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}

