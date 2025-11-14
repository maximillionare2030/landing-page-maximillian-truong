"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook to trigger animations when element scrolls into view
 */
export function useScrollAnimation(
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optionally disconnect after first trigger
          // observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { elementRef: elementRef as React.RefObject<HTMLElement>, isVisible };
}

