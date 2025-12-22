"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxContainerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down";
}

export function ParallaxContainer({
  children,
  speed = 0.5,
  className,
  direction = "up",
}: ParallaxContainerProps) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Calculate parallax offset
      const scrolled = window.scrollY;
      const elementCenter = elementTop + elementHeight / 2;
      const distanceFromCenter = elementCenter - windowHeight / 2;
      const parallaxOffset = distanceFromCenter * speed * (direction === "up" ? -1 : 1);

      setOffset(parallaxOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed, direction]);

  return (
    <div
      ref={elementRef}
      className={cn("relative", className)}
      style={{
        transform: `translateY(${offset}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
}

