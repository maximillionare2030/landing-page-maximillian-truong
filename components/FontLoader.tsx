"use client";

import { getAllFontClasses, getFontVariable, fontLoaders } from "@/lib/fonts";
import type { FontId } from "@/types/site";

interface FontLoaderProps {
  fontId?: FontId;
  children: React.ReactNode;
}

export function FontLoader({ fontId = "inter", children }: FontLoaderProps) {
  const selectedFontId = fontId || "inter";
  const fontVariable = getFontVariable(selectedFontId);
  const allFontClasses = getAllFontClasses();

  // Get the specific font class for the selected font
  const selectedFont = fontLoaders[selectedFontId as keyof typeof fontLoaders] || fontLoaders.inter;
  const fontClassName = selectedFont.className;

  return (
    <div
      className={`${allFontClasses} ${fontClassName}`}
      style={{ fontFamily: `var(${fontVariable})` }}
    >
      {children}
    </div>
  );
}

