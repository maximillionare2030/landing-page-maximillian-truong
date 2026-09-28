"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

export type TypedLine = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

type TypewriterProps = {
  /** Lines typed one after another, in order. */
  lines: TypedLine[];
  /** Milliseconds before the first character appears. */
  startDelay?: number;
  /** Milliseconds per character. */
  charDelay?: number;
  /** Pause between finishing one line and starting the next. */
  lineGap?: number;
  /** Keep the cursor blinking on the last line after typing finishes. */
  holdCursor?: boolean;
};

/**
 * Types each line in sequence with a blinking block cursor. The full text is
 * rendered invisibly underneath so layout never shifts while typing, and it
 * remains available to screen readers. Under prefers-reduced-motion (or with
 * no JS) the text simply appears.
 */
export function Typewriter({
  lines,
  startDelay = 0,
  charDelay = 32,
  lineGap = 320,
  holdCursor = false,
}: TypewriterProps) {
  // Index of the line being typed, and how many of its characters are shown.
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLine(lines.length - 1);
      setChars(lines[lines.length - 1]?.text.length ?? 0);
      setStarted(true);
      setDone(true);
      return;
    }
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [lines, startDelay]);

  useEffect(() => {
    if (!started || done) return;
    const current = lines[line];
    if (!current) {
      setDone(true);
      return;
    }
    if (chars < current.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), charDelay);
      return () => clearTimeout(t);
    }
    if (line < lines.length - 1) {
      const t = setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
      }, lineGap);
      return () => clearTimeout(t);
    }
    setDone(true);
  }, [started, done, line, chars, lines, charDelay, lineGap]);

  return (
    <>
      {lines.map((l, i) => {
        const shown = !started ? "" : i < line ? l.text : i === line ? l.text.slice(0, chars) : "";
        const active = started && i === line && (!done || holdCursor);
        return (
          <p key={i} className={`typed ${l.className ?? ""}`} style={l.style}>
            <span className="typed-ghost">{l.text}</span>
            <span className="typed-live" aria-hidden="true">
              {shown}
              {active && <span className="cursor" />}
            </span>
          </p>
        );
      })}
    </>
  );
}
