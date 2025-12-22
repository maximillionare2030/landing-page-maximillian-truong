"use client";

import { cn } from "@/lib/utils";

type DividerType = "wave" | "diagonal" | "geometric" | "gradient" | "dots";

interface SectionDividerProps {
  type?: DividerType;
  className?: string;
  flip?: boolean;
}

export function SectionDivider({
  type = "wave",
  className,
  flip = false,
}: SectionDividerProps) {
  const baseClasses = "w-full h-16 md:h-24 pointer-events-none";

  switch (type) {
    case "wave":
      return (
        <div className={cn(baseClasses, className)} aria-hidden="true">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d={flip
                ? "M0,120 L0,60 Q300,0 600,60 T1200,60 L1200,120 Z"
                : "M0,0 L0,60 Q300,120 600,60 T1200,60 L1200,0 Z"
              }
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      );

    case "diagonal":
      return (
        <div className={cn(baseClasses, className)} aria-hidden="true">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <polygon
              points={flip ? "0,120 1200,0 1200,120" : "0,0 1200,120 1200,0"}
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      );

    case "geometric":
      return (
        <div className={cn(baseClasses, className)} aria-hidden="true">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d={flip
                ? "M0,120 L200,80 L400,100 L600,60 L800,90 L1000,70 L1200,85 L1200,120 Z"
                : "M0,0 L200,40 L400,20 L600,60 L800,30 L1000,50 L1200,35 L1200,0 Z"
              }
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      );

    case "gradient":
      return (
        <div
          className={cn(
            baseClasses,
            "bg-gradient-to-b from-transparent via-background to-background",
            className
          )}
          aria-hidden="true"
        />
      );

    case "dots":
      return (
        <div className={cn(baseClasses, className)} aria-hidden="true">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-foreground/20"
                  style={{
                    animation: `pulse 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

