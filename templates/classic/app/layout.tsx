import type { Metadata } from "next";
import { Inter, Roboto, Open_Sans, Poppins, Montserrat, Lato } from "next/font/google";
import { readFile } from "fs/promises";
import { join } from "path";
import "../globals.css";
import type { SiteConfig } from "@/types/site";

// Define font loaders
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

// Font loader mapping
const fontLoaders = {
  inter,
  roboto,
  "open-sans": openSans,
  poppins,
  montserrat,
  lato,
} as const;

// Get all font classes as a space-separated string
function getAllFontClasses(): string {
  return Object.values(fontLoaders)
    .map((font) => font.className)
    .join(" ");
}

// Get CSS variable name for a font
function getFontVariable(fontName: string): string {
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
function getFontFamily(fontName: string): string {
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
function isSystemFont(fontName: string): boolean {
  return fontName === "times-new-roman" || fontName === "georgia";
}

async function getConfig(): Promise<SiteConfig | null> {
  try {
    const configPath = join(process.cwd(), "site.config.json");
    const configFile = await readFile(configPath, "utf-8");
    return JSON.parse(configFile) as SiteConfig;
  } catch (error) {
    // Config file doesn't exist or is invalid - return null for defaults
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();

  const title = config?.pageTitle || config?.name || "Landing Page";
  const description = config?.subheadline || config?.headline || "Personal landing page";

  const metadata: Metadata = {
    title,
    description,
  };

  // Add favicon if configured
  if (config?.favicon) {
    metadata.icons = {
      icon: config.favicon.startsWith('http') || config.favicon.startsWith('/')
        ? config.favicon
        : `/${config.favicon}`,
    };
  }

  return metadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getConfig();
  const selectedFont = config?.theme?.font || "inter";
  const isSystem = isSystemFont(selectedFont);

  // For system fonts, use direct font family; for Google Fonts, use CSS variables
  const fontFamilyStyle = isSystem
    ? { fontFamily: getFontFamily(selectedFont) }
    : { fontFamily: `var(${getFontVariable(selectedFont)})` };

  // Load all Google Fonts and apply the selected one (only for Google Fonts)
  const allFontClasses = getAllFontClasses();
  const selectedFontClass = isSystem
    ? ""
    : (fontLoaders[selectedFont as keyof typeof fontLoaders]?.className || fontLoaders.inter.className);

  return (
    <html lang="en">
      <body
        className={`${allFontClasses} ${selectedFontClass}`}
        style={fontFamilyStyle}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

