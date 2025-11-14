import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { SiteConfig } from "@/types/site";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const configJson = formData.get("config") as string;
    const assets = formData.getAll("assets") as File[];

    if (!configJson) {
      return NextResponse.json(
        { error: "Config is required" },
        { status: 400 }
      );
    }

    const config: SiteConfig = JSON.parse(configJson);

    // Save config.json to root
    const configPath = join(process.cwd(), "site.config.json");
    await writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");

    // Save assets to public/uploads
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    const savedAssets: string[] = [];
    for (const asset of assets) {
      const buffer = Buffer.from(await asset.arrayBuffer());
      const assetPath = join(uploadsDir, asset.name);
      await writeFile(assetPath, buffer);
      savedAssets.push(`/uploads/${asset.name}`);
    }

    return NextResponse.json({
      success: true,
      message: "Config and assets injected successfully",
      configPath: "site.config.json",
      assets: savedAssets,
    });
  } catch (error) {
    console.error("Error injecting config:", error);
    return NextResponse.json(
      { error: "Failed to inject config", details: String(error) },
      { status: 500 }
    );
  }
}

