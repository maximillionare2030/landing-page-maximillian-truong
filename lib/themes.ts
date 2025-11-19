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
 * Theme presets - Vibrant and visually distinct
 */
export const themePresets: Record<ThemeId, ThemePreset> = {
  noir: {
    id: "noir",
    name: "Noir",
    description: "Elegant grayscale with subtle blue accent",
    defaultBrandHex: "#6366f1",
    tokens: {
      background: "#000000",
      foreground: "#ffffff",
      card: "#0a0a0a",
      cardForeground: "#ffffff",
      primary: "#6366f1",
      primaryForeground: "#ffffff",
      secondary: "#1a1a1a",
      secondaryForeground: "#ffffff",
      accent: "#8b5cf6",
      accentForeground: "#ffffff",
      muted: "#262626",
      mutedForeground: "#a3a3a3",
      border: "#262626",
      input: "#1a1a1a",
      ring: "#6366f1",
    },
  },
  "neon-noir": {
    id: "neon-noir",
    name: "Neon Noir",
    description: "Vibrant neon colors on deep black - perfect for tech portfolios",
    defaultBrandHex: "#00f5ff",
    tokens: {
      background: "#000000",
      foreground: "#ffffff",
      card: "#0f0f23",
      cardForeground: "#ffffff",
      primary: "#00f5ff",
      primaryForeground: "#000000",
      secondary: "#1a0a2e",
      secondaryForeground: "#00f5ff",
      accent: "#ff00ff",
      accentForeground: "#ffffff",
      muted: "#1a1a2e",
      mutedForeground: "#a0a0ff",
      border: "#1a1a2e",
      input: "#0f0f23",
      ring: "#00f5ff",
    },
  },
  "slate-pop": {
    id: "slate-pop",
    name: "Slate Pop",
    description: "Modern slate with vibrant blue and amber accents",
    defaultBrandHex: "#3b82f6",
    tokens: {
      background: "#0f172a",
      foreground: "#f8fafc",
      card: "#1e293b",
      cardForeground: "#f8fafc",
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      secondary: "#334155",
      secondaryForeground: "#f8fafc",
      accent: "#f59e0b",
      accentForeground: "#0f172a",
      muted: "#475569",
      mutedForeground: "#cbd5e1",
      border: "#334155",
      input: "#1e293b",
      ring: "#3b82f6",
    },
  },
  "light-gradient": {
    id: "light-gradient",
    name: "Light Gradient",
    description: "Clean light theme with subtle gradients - perfect for professional portfolios",
    defaultBrandHex: "#6366f1",
    tokens: {
      background: "#ffffff",
      foreground: "#0a0a0a",
      card: "#fafafa",
      cardForeground: "#0a0a0a",
      primary: "#6366f1",
      primaryForeground: "#ffffff",
      secondary: "#f4f4f5",
      secondaryForeground: "#0a0a0a",
      accent: "#8b5cf6",
      accentForeground: "#ffffff",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      border: "#e4e4e7",
      input: "#f4f4f5",
      ring: "#6366f1",
    },
  },
  "sleek-dark": {
    id: "sleek-dark",
    name: "Sleek Dark",
    description: "Sleek dark theme with neon accents - bold and modern",
    defaultBrandHex: "#00d9ff",
    tokens: {
      background: "#0a0a0f",
      foreground: "#ffffff",
      card: "#151520",
      cardForeground: "#ffffff",
      primary: "#00d9ff",
      primaryForeground: "#000000",
      secondary: "#1a1a2e",
      secondaryForeground: "#00d9ff",
      accent: "#ff00ff",
      accentForeground: "#ffffff",
      muted: "#1a1a2e",
      mutedForeground: "#a0a0ff",
      border: "#1a1a2e",
      input: "#151520",
      ring: "#00d9ff",
    },
  },
};

/**
 * Normalize hex color (ensure it starts with #)
 */
function normalizeHex(hex?: string): string | undefined {
  if (!hex || hex.trim() === "") return undefined;
  return hex.startsWith("#") ? hex : `#${hex}`;
}

/**
 * Get theme tokens for a theme ID with optional custom colors
 * Custom colors override specific theme colors while keeping others
 */
export function getThemeTokens(
  themeId: ThemeId,
  brandHex?: string,
  primaryHex?: string,
  accentHex?: string,
  backgroundHex?: string
): ThemeTokens {
  // Get the base theme tokens
  const baseTokens = themePresets[themeId].tokens;

  // Start with base tokens
  let tokens: ThemeTokens = { ...baseTokens };

  // Check for custom colors first (normalize them all)
  const customBackground = normalizeHex(backgroundHex);
  const customPrimary = normalizeHex(primaryHex);
  const customAccent = normalizeHex(accentHex);
  const normalizedBrandHex = normalizeHex(brandHex);

  // Determine dark mode from background color (if custom) or theme default
  // If background is provided, determine from its lightness; otherwise use theme default
  const isDarkMode = customBackground
    ? hexToHsl(customBackground).l < 50
    : hexToHsl(baseTokens.background).l < 50;

  // If custom background is provided, override it and adjust related colors
  if (customBackground) {
    tokens.background = customBackground;
    const bgHsl = hexToHsl(customBackground);

    // Adjust foreground based on background lightness
    if (bgHsl.l < 20) {
      tokens.foreground = "#ffffff";
    } else if (bgHsl.l > 80) {
      tokens.foreground = "#000000";
    } else {
      // For mid-tones, determine based on whether it's closer to dark or light
      tokens.foreground = bgHsl.l < 50 ? "#ffffff" : "#000000";
    }

    // Adjust card to be a subtle variation of background
    const cardLightness = Math.max(5, Math.min(95, bgHsl.l + (bgHsl.l < 50 ? 5 : -5)));
    tokens.card = hslToHex(bgHsl.h, bgHsl.s, cardLightness);
    tokens.cardForeground = tokens.foreground;

    // Adjust secondary, muted, and border to work with background
    const secondaryLightness = Math.max(5, Math.min(95, bgHsl.l + (bgHsl.l < 50 ? 8 : -8)));
    tokens.secondary = hslToHex(bgHsl.h, Math.max(0, bgHsl.s - 20), secondaryLightness);
    tokens.secondaryForeground = tokens.foreground;

    const mutedLightness = Math.max(5, Math.min(95, bgHsl.l + (bgHsl.l < 50 ? 12 : -12)));
    tokens.muted = hslToHex(bgHsl.h, Math.max(0, bgHsl.s - 30), mutedLightness);
    tokens.mutedForeground = tokens.foreground === "#ffffff"
      ? "#a3a3a3"
      : "#71717a";

    const borderLightness = Math.max(5, Math.min(95, bgHsl.l + (bgHsl.l < 50 ? 10 : -10)));
    tokens.border = hslToHex(bgHsl.h, Math.max(0, bgHsl.s - 25), borderLightness);
    tokens.input = tokens.secondary;
  }

  // If custom primary color is provided, override it
  if (customPrimary) {
    const primaryHsl = hexToHsl(customPrimary);
    tokens.primary = customPrimary;
    tokens.primaryForeground = adjustForContrast(
      { h: primaryHsl.h, s: primaryHsl.s, l: 95 },
      customPrimary,
      true
    );
    // Only set ring if accent isn't custom
    if (!customAccent) {
      tokens.ring = customPrimary;
    }
  }

  // If custom accent color is provided, override it (this takes priority)
  if (customAccent) {
    const accentHsl = hexToHsl(customAccent);
    tokens.accent = customAccent;

    // Calculate accent foreground: if accent is dark, use light text; if accent is light, use dark text
    // Determine if accent is dark or light based on its luminance
    const accentLightness = accentHsl.l;
    const needsLightForeground = accentLightness < 50; // Dark accent needs light text

    tokens.accentForeground = adjustForContrast(
      { h: accentHsl.h, s: accentHsl.s, l: needsLightForeground ? 95 : 5 },
      customAccent,
      needsLightForeground
    );

    // Set ring to accent if primary isn't custom
    if (!customPrimary) {
      tokens.ring = customAccent;
    }
  }

  // Backward compatibility: if brandHex is provided (but not individual colors), use it for primary/accent
  if (normalizedBrandHex && !customPrimary && !customAccent) {
    const brandHsl = hexToHsl(normalizedBrandHex);

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

    tokens.primary = normalizedBrandHex;
    tokens.primaryForeground = adjustForContrast(
      { h: brandHsl.h, s: brandHsl.s, l: 95 },
      normalizedBrandHex,
      true
    );

    // Use lighter accent for dark backgrounds, darker for light backgrounds
    const accent = isDarkMode ? accentLight : accentDark;
    tokens.accent = accent;
    tokens.accentForeground = adjustForContrast(
      { h: brandHsl.h, s: brandHsl.s, l: isDarkMode ? 10 : 90 },
      accent,
      !isDarkMode
    );
    tokens.ring = normalizedBrandHex;
  }

  return tokens;
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

