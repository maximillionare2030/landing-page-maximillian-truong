import type { Metadata } from "next";
import "../globals.css";
import { fontLoaders, getAllFontClasses, getFontVariable } from "@/lib/fonts";
import { readFile } from "fs/promises";
import { join } from "path";
import type { SiteConfig } from "@/types/site";

async function getConfig(): Promise<SiteConfig | null> {
  try {
    const configPath = join(process.cwd(), "site.config.json");
    const configFile = await readFile(configPath, "utf-8");
    return JSON.parse(configFile) as SiteConfig;
  } catch (error) {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Personal landing page",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getConfig();
  const selectedFont = config?.theme?.font || "inter";
  const fontVariable = getFontVariable(selectedFont as any);

  // Load all fonts and apply the selected one
  const allFontClasses = getAllFontClasses();
  const selectedFontClass = fontLoaders[selectedFont as keyof typeof fontLoaders]?.className || fontLoaders.inter.className;

  return (
    <html lang="en">
      <body
        className={`${allFontClasses} ${selectedFontClass}`}
        style={{ fontFamily: `var(${fontVariable})` }}
      >
        {children}
      </body>
    </html>
  );
}

