import type { CSSProperties } from "react";

type SplitTextProps = {
  text: string;
  /** Milliseconds before the first character rises. */
  delay?: number;
  /** Milliseconds between successive characters. */
  step?: number;
};

/**
 * Splits text into per-character spans that rise into view with a stagger.
 * Pure CSS animation driven by a per-character index, so it renders on the
 * server and needs no JavaScript.
 */
export function SplitText({ text, delay = 0, step = 28 }: SplitTextProps) {
  return (
    <span className="split" aria-label={text} style={{ ["--split-delay" as string]: `${delay}ms` } as CSSProperties}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="char"
          style={{ ["--i" as string]: i, ["--step" as string]: `${step}ms` } as CSSProperties}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
