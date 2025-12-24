import type { Metadata } from "next";
import { readFile } from "fs/promises";
import { join } from "path";
import "../globals.css";
import { Providers } from "./providers";
import type { SiteConfig } from "@/types/site";
import { fontLoaders, getAllFontClasses, getFontVariable, getFontFamily, isSystemFont } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";

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
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

