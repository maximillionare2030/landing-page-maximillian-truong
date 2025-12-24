import { Inter, Roboto, Open_Sans, Poppins, Montserrat, Lato } from "next/font/google";

// Define font loaders
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

// Font loader mapping
export const fontLoaders = {
  inter,
  roboto,
  "open-sans": openSans,
  poppins,
  montserrat,
  lato,
} as const;

// Get all font classes as a space-separated string
export function getAllFontClasses(): string {
  return Object.values(fontLoaders)
    .map((font) => font.className)
    .join(" ");
}

// Get CSS variable name for a font
export function getFontVariable(fontName: string): string {
  const fontMap: Record<string, string> = {
    inter: "--font-inter",
    roboto: "--font-roboto",
    "open-sans": "--font-open-sans",
    poppins: "--font-poppins",
    montserrat: "--font-montserrat",
    lato: "--font-lato",
    "times-new-roman": "--font-times-new-roman",
    georgia: "--font-georgia",
  };

  return fontMap[fontName.toLowerCase()] || "--font-inter";
}

// Get font family string (for system fonts that don't use Next.js loaders)
export function getFontFamily(fontName: string): string {
  const fontFamilyMap: Record<string, string> = {
    inter: "var(--font-inter)",
    roboto: "var(--font-roboto)",
    "open-sans": "var(--font-open-sans)",
    poppins: "var(--font-poppins)",
    montserrat: "var(--font-montserrat)",
    lato: "var(--font-lato)",
    "times-new-roman": '"Times New Roman", Times, serif',
    georgia: "Georgia, serif",
  };

  return fontFamilyMap[fontName.toLowerCase()] || "var(--font-inter)";
}

// Check if a font is a system font (doesn't need Next.js loader)
export function isSystemFont(fontName: string): boolean {
  return fontName === "times-new-roman" || fontName === "georgia";
}

