"use client";

import { useEffect, useState } from "react";

const DIGITS = "0123456789";

/** UC Irvine, home base. */
const LAT = "33.6405°N";
const LON = "117.8443°W";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function glitchDigits(s: string, strength: number) {
  let out = "";
  for (const ch of s) {
    out += /\d/.test(ch) && Math.random() < strength ? DIGITS[Math.floor(Math.random() * 10)] : ch;
  }
  return out;
}

/**
 * A mono data strip under the hero: date, coordinates, a live UTC clock, and
 * session uptime. Every few seconds the digits briefly glitch through random
 * numbers before settling. Rendered only after mount so server and client
 * markup never disagree.
 */
export function HeroTicker() {
  const [now, setNow] = useState<Date | null>(null);
  const [uptime, setUptime] = useState(0);
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    setNow(new Date());
    const clock = setInterval(() => {
      setNow(new Date());
      setUptime((u) => u + 1);
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let burst: ReturnType<typeof setInterval> | undefined;
    // Every ~4s, glitch hard for a few frames, then ease back to real values.
    const every = setInterval(() => {
      let step = 0;
      burst = setInterval(() => {
        step += 1;
        setGlitch(Math.max(0, 0.9 - step * 0.18));
        if (step >= 5) {
          clearInterval(burst);
          setGlitch(0);
        }
      }, 60);
    }, 4200);
    return () => {
      clearInterval(every);
      if (burst) clearInterval(burst);
    };
  }, []);

  if (!now) return <div className="ticker" aria-hidden="true" />;

  const date = `${pad(now.getUTCMonth() + 1)}.${pad(now.getUTCDate())}.${now.getUTCFullYear()}`;
  const time = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
  const up = `${pad(Math.floor(uptime / 60))}:${pad(uptime % 60)}`;
  const cells = [
    ["SYS", date],
    ["POS", `${LAT} ${LON}`],
    ["CLK", time],
    ["UPT", up],
  ];

  return (
    <div className="ticker mono flex flex-wrap gap-x-8 gap-y-2" style={{ color: "var(--muted)" }}>
      {cells.map(([label, value]) => (
        <span key={label} className="whitespace-nowrap">
          <span style={{ color: "#4a4a4a" }}>{label} </span>
          <span className={glitch > 0 ? "glitching" : undefined}>
            {glitch > 0 ? glitchDigits(value, glitch) : value}
          </span>
        </span>
      ))}
    </div>
  );
}
