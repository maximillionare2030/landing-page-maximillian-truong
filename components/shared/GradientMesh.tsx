"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
  intensity?: number;
}

export function GradientMesh({ className, intensity = 0.3 }: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setIsReducedMotion(prefersReducedMotion);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create gradient points
    const points = [
      { x: 0.2, y: 0.2, color: "rgba(59, 130, 246, 0.3)" }, // blue
      { x: 0.8, y: 0.3, color: "rgba(139, 92, 246, 0.3)" }, // purple
      { x: 0.3, y: 0.8, color: "rgba(236, 72, 153, 0.3)" }, // pink
      { x: 0.7, y: 0.7, color: "rgba(34, 197, 94, 0.3)" }, // green
    ];

    let scrollY = 0;
    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update gradient positions based on scroll
      const scrollOffset = scrollY * 0.0005;

      // Create radial gradients for each point
      points.forEach((point, index) => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height + scrollOffset * (index % 2 === 0 ? 1 : -1) * 100;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.6);
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Blend modes for smoother gradients
      ctx.globalCompositeOperation = "screen";
      animationFrame = requestAnimationFrame(draw);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return (
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}

