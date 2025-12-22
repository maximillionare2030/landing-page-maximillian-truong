import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join, basename } from "path";
import type { SiteConfig } from "@/types/site";
import { normalizeImagePath } from "@/lib/utils";

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

    // Normalize image paths in config before saving
    // Update about image
    if (config.about?.image) {
      const normalized = normalizeImagePath(config.about.image);
      if (normalized) {
        // Extract filename and ensure it points to /uploads/
        const filename = basename(normalized);
        config.about.image = `/uploads/${filename}`;
      }
    }

    // Update portfolio images
    if (config.portfolio) {
      config.portfolio = config.portfolio.map((project) => {
        if (project.image) {
          const normalized = normalizeImagePath(project.image);
          if (normalized) {
            // Extract filename and ensure it points to /uploads/
            const filename = basename(normalized);
            project.image = `/uploads/${filename}`;
          } else {
            project.image = "";
          }
        }
        return project;
      });
    }

    // Update avatar and hero images
    if (config.images?.avatar) {
      const normalized = normalizeImagePath(config.images.avatar);
      if (normalized) {
        const filename = basename(normalized);
        config.images.avatar = `/uploads/${filename}`;
      }
    }

    if (config.images?.hero) {
      const normalized = normalizeImagePath(config.images.hero);
      if (normalized) {
        const filename = basename(normalized);
        config.images.hero = `/uploads/${filename}`;
      }
    }

    // Update experience icons
    if (config.experience) {
      config.experience = config.experience.map((exp) => {
        if (exp.icon) {
          const normalized = normalizeImagePath(exp.icon);
          if (normalized) {
            const filename = basename(normalized);
            exp.icon = `/uploads/${filename}`;
          } else {
            exp.icon = undefined;
          }
        }
        return exp;
      });
    }

    // Update skill images
    if (config.skills) {
      config.skills = config.skills.map((skill) => {
        if (skill.image) {
          const normalized = normalizeImagePath(skill.image);
          if (normalized) {
            const filename = basename(normalized);
            skill.image = `/uploads/${filename}`;
          } else {
            skill.image = undefined;
          }
        }
        return skill;
      });
    }

    // Update favicon
    if (config.favicon) {
      const normalized = normalizeImagePath(config.favicon);
      if (normalized) {
        const filename = basename(normalized);
        config.favicon = `/uploads/${filename}`;
      }
    }

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

