"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export function MagneticElement({
  children,
  className,
  strength = 0.3,
  disabled = false,
}: MagneticElementProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      const moveX = distanceX * strength;
      const moveY = distanceY * strength;

      setPosition({ x: moveX, y: moveY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [strength, disabled]);

  return (
    <div
      ref={elementRef}
      className={cn("transition-transform duration-300 ease-out", className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </div>
  );
}

