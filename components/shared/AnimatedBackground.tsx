"use client";

import { GeometricShapes } from "./GeometricShapes";
import { GradientMesh } from "./GradientMesh";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
  showShapes?: boolean;
  showGradient?: boolean;
  showGrid?: boolean;
  minimalGrid?: boolean;
}

export function AnimatedBackground({
  className,
  showShapes = true,
  showGradient = true,
  showGrid = true,
  minimalGrid = false,
}: AnimatedBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          maskImage: `
            radial-gradient(ellipse 90% 70% at 50% 50%, black 60%, transparent 100%)
          `,
          WebkitMaskImage: `
            radial-gradient(ellipse 90% 70% at 50% 50%, black 60%, transparent 100%)
          `,
        }}
      >
        {showGradient && <GradientMesh />}
        {/* Exclude shapes from header area - start shapes below 100px (header height) */}
        {showShapes && (
          <div className="absolute inset-0 top-[100px]">
            <GeometricShapes count={6} speed={0.5} />
          </div>
        )}
        {showGrid && (
          <div className={cn("absolute inset-0", minimalGrid ? "opacity-[0.015]" : "opacity-[0.03]")}>
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: minimalGrid ? "70px 70px" : "50px 50px",
                animation: "grid-move 20s linear infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

