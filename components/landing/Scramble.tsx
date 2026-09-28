"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const GLYPHS = "0123456789<>-_/\\[]{}=+*^?#%&";

type ScrambleProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Milliseconds before the decode starts on mount. */
  startDelay?: number;
  /** Total decode time in milliseconds. */
  duration?: number;
  /** Re-run the decode when hovered. */
  rescrambleOnHover?: boolean;
};

/**
 * Renders text that resolves out of random glyphs, left to right. The real
 * text is always in the DOM for screen readers; the scrambled version is
 * painted on top. Under prefers-reduced-motion the text is shown as-is.
 */
export function Scramble({
  text,
  className = "",
  style,
  startDelay = 0,
  duration = 1100,
  rescrambleOnHover = true,
}: ScrambleProps) {
  const [shown, setShown] = useState<string | null>(null);
  const frame = useRef<number>(0);
  const reduce = useRef(false);

  const run = useCallback(() => {
    if (reduce.current) {
      setShown(text);
      return;
    }
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const n = text.length;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Characters resolve progressively; unresolved ones cycle through glyphs.
      const resolved = Math.floor(t * n * 1.15);
      let out = "";
      for (let i = 0; i < n; i++) {
        const ch = text[i];
        if (ch === " ") out += " ";
        else if (i < resolved) out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else setShown(text);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(run, startDelay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(frame.current);
    };
  }, [run, startDelay]);

  return (
    <span
      className={`scramble ${className}`}
      style={style}
      onMouseEnter={rescrambleOnHover ? run : undefined}
      data-ready={shown !== null ? "true" : "false"}
    >
      <span className="scramble-ghost">{text}</span>
      <span className="scramble-live" aria-hidden="true">
        {shown ?? ""}
      </span>
    </span>
  );
}
