import type { ThemeId } from "@/types/site";

export interface ThemeTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  tokens: ThemeTokens;
  defaultBrandHex?: string;
}

/**
 * Convert hex color to HSL
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Calculate relative luminance for contrast checking
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.slice(0, 2), 16);
  const g1 = parseInt(hex1.slice(2, 4), 16);
  const b1 = parseInt(hex1.slice(4, 6), 16);

  const r2 = parseInt(hex2.slice(0, 2), 16);
  const g2 = parseInt(hex2.slice(2, 4), 16);
  const b2 = parseInt(hex2.slice(4, 6), 16);

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
 */
export function meetsAAContrast(
  foreground: string,
  background: string,
  largeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Adjust lightness to meet contrast requirements
 */
function adjustForContrast(
  baseHsl: { h: number; s: number; l: number },
  targetBg: string,
  isForeground: boolean
): string {
  let { l } = baseHsl;
  const step = isForeground ? -5 : 5;
  const maxIterations = 20;

  for (let i = 0; i < maxIterations; i++) {
    const testColor = `hsl(${baseHsl.h}, ${baseHsl.s}%, ${l}%)`;
    const hex = hslToHex(baseHsl.h, baseHsl.s, l);

    if (meetsAAContrast(hex, targetBg)) {
      return hex;
    }

    l += step;
    if (l < 0) l = 0;
    if (l > 100) l = 100;
  }

  // Fallback to ensure contrast
  return isForeground ? "#ffffff" : "#000000";
}

/**
 * Convert HSL to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate theme tokens from a brand color
 */
export function generateThemeFromBrand(
  brandHex: string,
  darkMode = true
): ThemeTokens {
  const brandHsl = hexToHsl(brandHex);
  const bg = darkMode ? "#0a0a0a" : "#ffffff";
  const fg = darkMode ? "#fafafa" : "#0a0a0a";

  // Generate accent colors with variations
  const accentLight = hslToHex(
    brandHsl.h,
    Math.min(brandHsl.s + 20, 100),
    Math.min(brandHsl.l + 20, 90)
  );
  const accentDark = hslToHex(
    brandHsl.h,
    brandHsl.s,
    Math.max(brandHsl.l - 20, 10)
  );

  const primary = brandHex;
  const primaryForeground = adjustForContrast(
    { h: brandHsl.h, s: brandHsl.s, l: 95 },
    primary,
    true
  );

  const accent = darkMode ? accentLight : accentDark;
  const accentForeground = adjustForContrast(
    { h: brandHsl.h, s: brandHsl.s, l: darkMode ? 10 : 90 },
    accent,
    !darkMode
  );

  return {
    background: bg,
    foreground: fg,
    card: darkMode ? "#1a1a1a" : "#fafafa",
    cardForeground: fg,
    primary,
    primaryForeground,
    secondary: darkMode ? "#262626" : "#f4f4f5",
    secondaryForeground: fg,
    accent,
    accentForeground,
    muted: darkMode ? "#262626" : "#f4f4f5",
    mutedForeground: darkMode ? "#a3a3a3" : "#71717a",
    border: darkMode ? "#262626" : "#e4e4e7",
    input: darkMode ? "#262626" : "#f4f4f5",
    ring: accent,
  };
}

/**
 * Theme presets
 */
export const themePresets: Record<ThemeId, ThemePreset> = {
  noir: {
    id: "noir",
    name: "Noir",
    description: "Grayscale monochrome with subtle accent",
    defaultBrandHex: "#6b7280",
    tokens: {
      background: "#0a0a0a",
      foreground: "#fafafa",
      card: "#1a1a1a",
      cardForeground: "#fafafa",
      primary: "#6b7280",
      primaryForeground: "#ffffff",
      secondary: "#262626",
      secondaryForeground: "#fafafa",
      accent: "#9ca3af",
      accentForeground: "#0a0a0a",
      muted: "#262626",
      mutedForeground: "#a3a3a3",
      border: "#262626",
      input: "#262626",
      ring: "#9ca3af",
    },
  },
  "neon-noir": {
    id: "neon-noir",
    name: "Neon Noir",
    description: "Deep slate/black with neon accent (teal/pink/citrus variants)",
    defaultBrandHex: "#00f5ff",
    tokens: {
      background: "#0a0a0a",
      foreground: "#fafafa",
      card: "#1a1a1a",
      cardForeground: "#fafafa",
      primary: "#00f5ff",
      primaryForeground: "#0a0a0a",
      secondary: "#262626",
      secondaryForeground: "#fafafa",
      accent: "#ff00ff",
      accentForeground: "#ffffff",
      muted: "#262626",
      mutedForeground: "#a3a3a3",
      border: "#262626",
      input: "#262626",
      ring: "#00f5ff",
    },
  },
  "slate-pop": {
    id: "slate-pop",
    name: "Slate Pop",
    description: "Neutral slate base with one bold accent",
    defaultBrandHex: "#3b82f6",
    tokens: {
      background: "#0f172a",
      foreground: "#f1f5f9",
      card: "#1e293b",
      cardForeground: "#f1f5f9",
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      secondary: "#334155",
      secondaryForeground: "#f1f5f9",
      accent: "#f59e0b",
      accentForeground: "#0f172a",
      muted: "#334155",
      mutedForeground: "#94a3b8",
      border: "#334155",
      input: "#334155",
      ring: "#3b82f6",
    },
  },
};

/**
 * Get theme tokens for a theme ID and optional brand color
 */
export function getThemeTokens(
  themeId: ThemeId,
  brandHex?: string,
  darkMode = true
): ThemeTokens {
  if (brandHex) {
    return generateThemeFromBrand(brandHex, darkMode);
  }
  return themePresets[themeId].tokens;
}

/**
 * Convert theme tokens to CSS variables string
 */
export function tokensToCSS(tokens: ThemeTokens): string {
  return `
    --background: ${tokens.background};
    --foreground: ${tokens.foreground};
    --card: ${tokens.card};
    --card-foreground: ${tokens.cardForeground};
    --primary: ${tokens.primary};
    --primary-foreground: ${tokens.primaryForeground};
    --secondary: ${tokens.secondary};
    --secondary-foreground: ${tokens.secondaryForeground};
    --accent: ${tokens.accent};
    --accent-foreground: ${tokens.accentForeground};
    --muted: ${tokens.muted};
    --muted-foreground: ${tokens.mutedForeground};
    --border: ${tokens.border};
    --input: ${tokens.input};
    --ring: ${tokens.ring};
  `.trim();
}

