"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: React.ReactNode[];
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  gap?: number;
  showControls?: boolean;
}

export function Marquee({
  items,
  className,
  speed = 50,
  pauseOnHover = true,
  direction = "left",
  gap = 16,
  showControls = true,
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemWidth = useRef(0);
  const animationRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate items multiple times for seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  // Calculate item width on mount
  useEffect(() => {
    if (scrollContainerRef.current && items.length > 0) {
      const firstItem = scrollContainerRef.current.querySelector('.marquee-item');
      if (firstItem) {
        itemWidth.current = firstItem.getBoundingClientRect().width + gap;
      }
    }
  }, [items, gap]);

  // Handle auto-scroll animation
  useEffect(() => {
    if (!scrollContainerRef.current || isPaused || isUserInteracting) {
      return;
    }

    const animate = () => {
      if (!scrollContainerRef.current || isPaused || isUserInteracting) {
        return;
      }

      const container = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? 0.5 : -0.5;

      container.scrollLeft += scrollAmount;

      // Reset scroll position for seamless loop
      const scrollWidth = container.scrollWidth / 3; // Since we duplicate 3 times
      if (direction === "left" && container.scrollLeft >= scrollWidth) {
        container.scrollLeft = container.scrollLeft - scrollWidth;
      } else if (direction === "right" && container.scrollLeft <= 0) {
        container.scrollLeft = scrollWidth;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isUserInteracting, direction]);

  // Handle click navigation
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    setIsUserInteracting(true);
    setIsPaused(true);
    const scrollAmount = itemWidth.current * 2;
    scrollContainerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });

    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      setIsPaused(false);
    }, 2000);
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    setIsUserInteracting(true);
    setIsPaused(true);
    const scrollAmount = itemWidth.current * 2;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });

    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      setIsPaused(false);
    }, 2000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden group", className)}
      onMouseEnter={() => pauseOnHover && !isUserInteracting && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && !isUserInteracting && setIsPaused(false)}
    >
      {/* Navigation buttons */}
      {showControls && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent/10 hover:border-accent/50 hover:scale-110 shadow-lg"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent/10 hover:border-accent/50 hover:scale-110 shadow-lg"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Scrollable container - no dragging, scrollbar hidden */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          gap: `${gap}px`,
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div key={index} className="flex-shrink-0 marquee-item">
            {item}
          </div>
        ))}
      </div>

      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}

