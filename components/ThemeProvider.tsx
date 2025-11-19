"use client";

import { useMemo } from "react";
import { getThemeTokens, themePresets } from "@/lib/themes";
import type { SiteConfig } from "@/types/site";

interface ThemeProviderProps {
  config: SiteConfig;
  children: React.ReactNode;
}

/**
 * Convert hex color to HSL space-separated format (Tailwind format)
 */
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace("#", "");

  // Handle 3-character hex codes
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

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

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}

export function ThemeProvider({ config, children }: ThemeProviderProps) {
  // Get theme tokens and generate CSS variables
  const { themeClass, cssVariables } = useMemo(() => {
    const themeTokens = getThemeTokens(
      config.theme.id,
      config.theme.brandHex,
      config.theme.primaryHex,
      config.theme.accentHex,
      config.theme.backgroundHex
    );

    // Create a unique class name for this theme instance
    const themeId = config.theme.id;
    // Create unique class name based on all custom colors
    const customColors = [
      config.theme.primaryHex,
      config.theme.accentHex,
      config.theme.backgroundHex,
      config.theme.brandHex,
    ].filter(Boolean);
    const colorSuffix = customColors.length > 0
      ? `-${customColors.map(c => c?.replace("#", "").substring(0, 6)).join("-")}`
      : "";
    // Determine mode suffix from background color lightness
    const bgColor = config.theme.backgroundHex || themePresets[config.theme.id].tokens.background;
    const bgHslStr = hexToHSL(bgColor);
    // Parse HSL string "h s% l%" to get lightness value
    const lightnessMatch = bgHslStr.match(/(\d+)%$/);
    const lightness = lightnessMatch ? parseFloat(lightnessMatch[1]) : 50;
    const isDark = lightness < 50;
    const modeSuffix = isDark ? "-dark" : "-light";
    const themeClass = `site-theme-${themeId}${colorSuffix}${modeSuffix}`;

    // Generate CSS variables string in HSL format
    const cssVars = `
      --background: ${hexToHSL(themeTokens.background)};
      --foreground: ${hexToHSL(themeTokens.foreground)};
      --card: ${hexToHSL(themeTokens.card)};
      --card-foreground: ${hexToHSL(themeTokens.cardForeground)};
      --primary: ${hexToHSL(themeTokens.primary)};
      --primary-foreground: ${hexToHSL(themeTokens.primaryForeground)};
      --secondary: ${hexToHSL(themeTokens.secondary)};
      --secondary-foreground: ${hexToHSL(themeTokens.secondaryForeground)};
      --accent: ${hexToHSL(themeTokens.accent)};
      --accent-foreground: ${hexToHSL(themeTokens.accentForeground)};
      --muted: ${hexToHSL(themeTokens.muted)};
      --muted-foreground: ${hexToHSL(themeTokens.mutedForeground)};
      --border: ${hexToHSL(themeTokens.border)};
      --input: ${hexToHSL(themeTokens.input)};
      --ring: ${hexToHSL(themeTokens.ring)};
    `.trim();

    return {
      themeClass,
      cssVariables: cssVars,
    };
  }, [
    config.theme.id,
    config.theme.brandHex,
    config.theme.primaryHex,
    config.theme.accentHex,
    config.theme.backgroundHex,
  ]);

  return (
    <>
      {/* Inject CSS variables using a style tag with scoped class selector */}
      <style
        key={themeClass}
        dangerouslySetInnerHTML={{
          __html: `
            .${themeClass} {
              ${cssVariables}
            }
          `,
        }}
      />
      <div
        className={`${themeClass} min-h-screen flex flex-col bg-background text-foreground`}
      >
        {children}
      </div>
    </>
  );
}

