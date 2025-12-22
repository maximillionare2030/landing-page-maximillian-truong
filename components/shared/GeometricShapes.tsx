"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GeometricShapesProps {
  className?: string;
  count?: number;
  speed?: number;
}

// Deterministic pseudo-random function based on seed
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function GeometricShapes({
  className,
  count = 8,
  speed = 1
}: GeometricShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const shapes = container.querySelectorAll(".shape");

    shapes.forEach((shape, index) => {
      const element = shape as HTMLElement;
      const delay = index * 0.5;
      // Use deterministic values based on index
      const duration = 20 + (seededRandom(index * 7) * 10);
      const direction = seededRandom(index * 11) > 0.5 ? 1 : -1;

      element.style.animation = `float-${index} ${duration}s ease-in-out infinite`;
      element.style.animationDelay = `${delay}s`;

      // Create unique keyframe animation for each shape
      const style = document.createElement("style");
      style.textContent = `
        @keyframes float-${index} {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(${30 * direction * speed}px, ${-20 * speed}px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translate(${-20 * direction * speed}px, ${-40 * speed}px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translate(${20 * direction * speed}px, ${-10 * speed}px) rotate(270deg) scale(1.05);
          }
        }
      `;
      document.head.appendChild(style);
    });

    return () => {
      // Cleanup styles on unmount
      document.querySelectorAll("style").forEach((style) => {
        if (style.textContent?.includes("float-")) {
          style.remove();
        }
      });
    };
  }, [count, speed, mounted]);

  // Use deterministic values based on index to ensure server/client match
  const shapes = Array.from({ length: count }, (_, i) => {
    // Use seeded random based on index for deterministic values
    const size = 40 + (seededRandom(i * 3) * 60);
    const left = seededRandom(i * 5) * 100;
    const top = seededRandom(i * 7) * 100;
    const shapeType = Math.floor(seededRandom(i * 13) * 3);
    const opacity = 0.1 + (seededRandom(i * 17) * 0.15);

    return (
      <div
        key={i}
        className="shape absolute pointer-events-none"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
        }}
      >
        {shapeType === 0 && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
        )}
        {shapeType === 1 && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,10 90,90 10,90"
              fill="currentColor"
              className="text-accent"
            />
          </svg>
        )}
        {shapeType === 2 && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              fill="currentColor"
              className="text-primary"
              transform="rotate(45 50 50)"
            />
          </svg>
        )}
      </div>
    );
  });

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {shapes}
    </div>
  );
}

