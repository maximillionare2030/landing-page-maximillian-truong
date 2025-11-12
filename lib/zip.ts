import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { SiteConfig } from "@/types/site";

/**
 * Export site config and assets as a ZIP file
 */
export async function exportSiteConfig(
  config: SiteConfig,
  assets: Map<string, Blob>
): Promise<void> {
  const zip = new JSZip();

  // Add config.json
  zip.file("config.json", JSON.stringify(config, null, 2));

  // Add assets folder
  const assetsFolder = zip.folder("assets");
  if (!assetsFolder) {
    throw new Error("Failed to create assets folder in ZIP");
  }

  // Add all assets to the assets folder
  for (const [filename, blob] of assets.entries()) {
    assetsFolder.file(filename, blob);
  }

  // Generate ZIP file
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Generate filename from config
  const firstName = config.name.split(" ")[0]?.toLowerCase() || "site";
  const lastName = config.name.split(" ").slice(1).join("-").toLowerCase() || "config";
  const filename = `landing-page-${firstName}-${lastName}-${Date.now()}.zip`;

  // Download the ZIP file
  saveAs(zipBlob, filename);
}

/**
 * Create a ZIP from config JSON string and asset files
 */
export async function createZipFromData(
  configJson: string,
  assets: Map<string, Blob>
): Promise<Blob> {
  const zip = new JSZip();

  // Add config.json
  zip.file("config.json", configJson);

  // Add assets folder
  const assetsFolder = zip.folder("assets");
  if (!assetsFolder) {
    throw new Error("Failed to create assets folder in ZIP");
  }

  // Add all assets
  for (const [filename, blob] of assets.entries()) {
    assetsFolder.file(filename, blob);
  }

  return zip.generateAsync({ type: "blob" });
}

/**
 * Extract config and assets from a ZIP file
 */
export async function extractFromZip(zipBlob: Blob): Promise<{
  config: SiteConfig;
  assets: Map<string, Blob>;
}> {
  const zip = await JSZip.loadAsync(zipBlob);
  const assets = new Map<string, Blob>();

  // Extract config.json
  const configFile = zip.file("config.json");
  if (!configFile) {
    throw new Error("config.json not found in ZIP");
  }

  const configJson = await configFile.async("string");
  const config = JSON.parse(configJson) as SiteConfig;

  // Extract assets
  const assetsFolder = zip.folder("assets");
  if (assetsFolder) {
    const assetFiles = Object.keys(assetsFolder.files).filter(
      (filename) => !assetsFolder.files[filename].dir
    );

    for (const filename of assetFiles) {
      const file = assetsFolder.files[filename];
      if (file) {
        const blob = await file.async("blob");
        // Remove 'assets/' prefix from filename
        const cleanFilename = filename.replace(/^assets\//, "");
        assets.set(cleanFilename, blob);
      }
    }
  }

  return { config, assets };
}

