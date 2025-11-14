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
  try {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid config: config must be an object");
    }

    if (!config.name || typeof config.name !== "string") {
      throw new Error("Invalid config: name is required");
    }

    const zip = new JSZip();

    // Add config.json with error handling
    try {
      const configJson = JSON.stringify(config, null, 2);
      zip.file("config.json", configJson);
    } catch (error) {
      throw new Error(`Failed to serialize config to JSON: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Add assets folder
    const assetsFolder = zip.folder("assets");
    if (!assetsFolder) {
      throw new Error("Failed to create assets folder in ZIP");
    }

    // Add all assets to the assets folder
    for (const [filename, blob] of assets.entries()) {
      if (!filename || typeof filename !== "string") {
        console.warn(`Skipping invalid filename: ${filename}`);
        continue;
      }
      if (!blob || !(blob instanceof Blob)) {
        console.warn(`Skipping invalid blob for filename: ${filename}`);
        continue;
      }
      try {
        assetsFolder.file(filename, blob);
      } catch (error) {
        console.error(`Failed to add file ${filename} to ZIP:`, error);
        throw new Error(`Failed to add file ${filename} to ZIP: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Generate ZIP file
    let zipBlob: Blob;
    try {
      zipBlob = await zip.generateAsync({ type: "blob" });
    } catch (error) {
      throw new Error(`Failed to generate ZIP file: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Generate filename from config
    const firstName = config.name.split(" ")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "site";
    const lastName = config.name.split(" ").slice(1).join("-").toLowerCase().replace(/[^a-z0-9-]/g, "") || "config";
    const sanitizedName = `${firstName}${lastName ? `-${lastName}` : ""}`;
    const filename = `landing-page-${sanitizedName}-${Date.now()}.zip`;

    // Download the ZIP file
    try {
      saveAs(zipBlob, filename);
    } catch (error) {
      throw new Error(`Failed to download ZIP file: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Export failed: ${String(error)}`);
  }
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

