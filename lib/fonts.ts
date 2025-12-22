import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Raleway,
  Playfair_Display,
  Merriweather,
  Source_Sans_3,
  Nunito,
  Work_Sans,
  DM_Sans,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Outfit,
  Manrope,
  Sora,
  Figtree,
} from "next/font/google";

export type FontId =
  | "inter"
  | "roboto"
  | "open-sans"
  | "lato"
  | "montserrat"
  | "poppins"
  | "raleway"
  | "playfair-display"
  | "merriweather"
  | "source-sans-3"
  | "nunito"
  | "work-sans"
  | "dm-sans"
  | "plus-jakarta-sans"
  | "space-grotesk"
  | "outfit"
  | "manrope"
  | "sora"
  | "figtree";

export interface FontConfig {
  id: FontId;
  name: string;
  category: "sans-serif" | "serif" | "display";
  description: string;
  googleFontsUrl: string;
}

// Font configurations with metadata
export const fontConfigs: Record<FontId, FontConfig> = {
  inter: {
    id: "inter",
    name: "Inter",
    category: "sans-serif",
    description: "Modern, clean sans-serif. Great for tech and professional sites.",
    googleFontsUrl: "https://fonts.google.com/specimen/Inter",
  },
  roboto: {
    id: "roboto",
    name: "Roboto",
    category: "sans-serif",
    description: "Google's signature font. Friendly and approachable.",
    googleFontsUrl: "https://fonts.google.com/specimen/Roboto",
  },
  "open-sans": {
    id: "open-sans",
    name: "Open Sans",
    category: "sans-serif",
    description: "Highly legible humanist sans-serif. Excellent readability.",
    googleFontsUrl: "https://fonts.google.com/specimen/Open+Sans",
  },
  lato: {
    id: "lato",
    name: "Lato",
    category: "sans-serif",
    description: "Warm, stable, and friendly. Great for professional portfolios.",
    googleFontsUrl: "https://fonts.google.com/specimen/Lato",
  },
  montserrat: {
    id: "montserrat",
    name: "Montserrat",
    category: "sans-serif",
    description: "Geometric sans-serif with modern elegance. Perfect for bold designs.",
    googleFontsUrl: "https://fonts.google.com/specimen/Montserrat",
  },
  poppins: {
    id: "poppins",
    name: "Poppins",
    category: "sans-serif",
    description: "Geometric sans-serif with friendly character. Modern and versatile.",
    googleFontsUrl: "https://fonts.google.com/specimen/Poppins",
  },
  raleway: {
    id: "raleway",
    name: "Raleway",
    category: "sans-serif",
    description: "Elegant sans-serif with a single weight. Great for headlines.",
    googleFontsUrl: "https://fonts.google.com/specimen/Raleway",
  },
  "playfair-display": {
    id: "playfair-display",
    name: "Playfair Display",
    category: "serif",
    description: "Elegant serif with high contrast. Perfect for editorial style.",
    googleFontsUrl: "https://fonts.google.com/specimen/Playfair+Display",
  },
  merriweather: {
    id: "merriweather",
    name: "Merriweather",
    category: "serif",
    description: "Serif designed for screens. Excellent readability for body text.",
    googleFontsUrl: "https://fonts.google.com/specimen/Merriweather",
  },
  "source-sans-3": {
    id: "source-sans-3",
    name: "Source Sans 3",
    category: "sans-serif",
    description: "Adobe's open source font family. Professional and clean.",
    googleFontsUrl: "https://fonts.google.com/specimen/Source+Sans+3",
  },
  nunito: {
    id: "nunito",
    name: "Nunito",
    category: "sans-serif",
    description: "Rounded sans-serif with friendly personality. Great for modern brands.",
    googleFontsUrl: "https://fonts.google.com/specimen/Nunito",
  },
  "work-sans": {
    id: "work-sans",
    name: "Work Sans",
    category: "sans-serif",
    description: "Professional sans-serif designed for screens. Excellent readability.",
    googleFontsUrl: "https://fonts.google.com/specimen/Work+Sans",
  },
  "dm-sans": {
    id: "dm-sans",
    name: "DM Sans",
    category: "sans-serif",
    description: "Versatile sans-serif from Google. Great for UI and body text.",
    googleFontsUrl: "https://fonts.google.com/specimen/DM+Sans",
  },
  "plus-jakarta-sans": {
    id: "plus-jakarta-sans",
    name: "Plus Jakarta Sans",
    category: "sans-serif",
    description: "Modern sans-serif with excellent readability. Great for startups.",
    googleFontsUrl: "https://fonts.google.com/specimen/Plus+Jakarta+Sans",
  },
  "space-grotesk": {
    id: "space-grotesk",
    name: "Space Grotesk",
    category: "sans-serif",
    description: "Geometric sans-serif with character. Perfect for tech and design.",
    googleFontsUrl: "https://fonts.google.com/specimen/Space+Grotesk",
  },
  outfit: {
    id: "outfit",
    name: "Outfit",
    category: "sans-serif",
    description: "Modern variable font. Clean and versatile for any project.",
    googleFontsUrl: "https://fonts.google.com/specimen/Outfit",
  },
  manrope: {
    id: "manrope",
    name: "Manrope",
    category: "sans-serif",
    description: "Open-source sans-serif with open forms. Great for web interfaces.",
    googleFontsUrl: "https://fonts.google.com/specimen/Manrope",
  },
  sora: {
    id: "sora",
    name: "Sora",
    category: "sans-serif",
    description: "Minimalist sans-serif. Clean and modern for contemporary designs.",
    googleFontsUrl: "https://fonts.google.com/specimen/Sora",
  },
  figtree: {
    id: "figtree",
    name: "Figtree",
    category: "sans-serif",
    description: "Friendly and versatile. Perfect for blogs and content-heavy sites.",
    googleFontsUrl: "https://fonts.google.com/specimen/Figtree",
  },
};

// Font loader functions - load all fonts at build time with CSS variables
// Next.js requires fonts to be loaded at build time and assigned to individual const variables
// Each font must be a separate const in module scope
const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoFont = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-roboto" });
const openSansFont = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });
const latoFont = Lato({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-lato" });
const montserratFont = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const poppinsFont = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });
const ralewayFont = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const playfairDisplayFont = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const merriweatherFont = Merriweather({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-merriweather" });
const sourceSans3Font = Source_Sans_3({ subsets: ["latin"], weight: ["300", "400", "600", "700"], variable: "--font-source-sans-3" });
const nunitoFont = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const workSansFont = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });
const dmSansFont = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const plusJakartaSansFont = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta-sans" });
const spaceGroteskFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const outfitFont = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const manropeFont = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const soraFont = Sora({ subsets: ["latin"], variable: "--font-sora" });
const figtreeFont = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

// Export font loaders as an object referencing the const variables
export const fontLoaders = {
  inter: interFont,
  roboto: robotoFont,
  "open-sans": openSansFont,
  lato: latoFont,
  montserrat: montserratFont,
  poppins: poppinsFont,
  raleway: ralewayFont,
  "playfair-display": playfairDisplayFont,
  merriweather: merriweatherFont,
  "source-sans-3": sourceSans3Font,
  nunito: nunitoFont,
  "work-sans": workSansFont,
  "dm-sans": dmSansFont,
  "plus-jakarta-sans": plusJakartaSansFont,
  "space-grotesk": spaceGroteskFont,
  outfit: outfitFont,
  manrope: manropeFont,
  sora: soraFont,
  figtree: figtreeFont,
} as const;

// Get all font CSS variable classes as a single string
export function getAllFontClasses(): string {
  return Object.values(fontLoaders)
    .map((font) => font.variable)
    .join(" ");
}

// Get CSS variable name for a font
export function getFontVariable(fontId: FontId = "inter"): string {
  const font = fontLoaders[fontId];
  if (!font) return fontLoaders.inter.variable;
  return font.variable;
}

// Get font class name for a given font ID (for applying via className)
export function getFontClassName(fontId: FontId = "inter"): string {
  const font = fontLoaders[fontId];
  if (!font) return fontLoaders.inter.className;
  return font.className;
}

// Get font config by ID
export function getFontConfig(fontId: FontId = "inter"): FontConfig {
  return fontConfigs[fontId] || fontConfigs.inter;
}

// Get all fonts grouped by category
export function getFontsByCategory(): Record<string, FontConfig[]> {
  const categories: Record<string, FontConfig[]> = {
    "sans-serif": [],
    serif: [],
    display: [],
  };

  Object.values(fontConfigs).forEach((font) => {
    categories[font.category].push(font);
  });

  return categories;
}

