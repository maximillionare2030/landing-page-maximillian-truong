"use client";

import { ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "both";
  intensity?: "low" | "medium" | "high";
  style?: React.CSSProperties;
}

export function AnimatedCard({
  children,
  className,
  glowColor = "both",
  intensity = "medium",
  style,
}: AnimatedCardProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform({ x, y, rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  const glowIntensity = {
    low: "opacity-30",
    medium: "opacity-50",
    high: "opacity-70",
  }[intensity];

  const glowClasses = {
    primary: "shadow-[0_0_30px_hsl(var(--primary)/0.5)]",
    accent: "shadow-[0_0_30px_hsl(var(--accent)/0.5)]",
    both: "shadow-[0_0_30px_hsl(var(--primary)/0.3),0_0_60px_hsl(var(--accent)/0.3)]",
  }[glowColor];

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative group transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: style?.transform
          ? `${style.transform} perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`
          : `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transformStyle: "preserve-3d",
        ...(style?.opacity !== undefined && { opacity: style.opacity }),
        ...(style?.transition && { transition: style.transition }),
        ...(style?.animationDelay && { animationDelay: style.animationDelay }),
      }}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-lg blur-xl transition-opacity duration-300",
          glowClasses,
          glowIntensity,
          "opacity-0 group-hover:opacity-100"
        )}
        aria-hidden="true"
      />

      {/* Card content */}
      <div className="relative h-full">
        {children}
      </div>
    </div>
  );
}

