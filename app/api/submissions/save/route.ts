import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { validateSiteConfig } from "@/lib/validate";
import { saveSubmission, saveAsset, prisma } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import type { SiteConfig } from "@/types/site";

export async function POST(request: NextRequest) {
  try {
    // Optional: Require auth for submissions
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const formData = await request.formData();
    const configJson = formData.get("config") as string;

    if (!configJson) {
      return NextResponse.json(
        { error: "Config is required" },
        { status: 400 }
      );
    }

    let config: SiteConfig;
    try {
      config = JSON.parse(configJson);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in config", details: String(parseError) },
        { status: 400 }
      );
    }

    // Clean up config - remove darkMode if it exists (we removed it)
    if (config.theme?.darkMode !== undefined) {
      delete config.theme.darkMode;
    }

    // Clean up image placeholders - if images are sent as Files, clear placeholders
    // Check if about image is being sent as File (check without consuming)
    if (formData.has("aboutImage") && config.about?.image === "uploaded") {
      config.about.image = undefined;
    }

    // Check for project images sent as Files (check without consuming)
    const projectImageIndices = new Set<number>();
    let checkIndex = 0;
    while (formData.has(`projectImage-${checkIndex}`)) {
      projectImageIndices.add(checkIndex);
      checkIndex++;
    }

    // Clear "uploaded" placeholders for projects with File uploads
    if (config.portfolio && projectImageIndices.size > 0) {
      config.portfolio = config.portfolio.map((project, index) => {
        if (projectImageIndices.has(index) && project.image === "uploaded") {
          return { ...project, image: "" };
        }
        return project;
      });
    }

    // Validate config
    const validation = validateSiteConfig(config);
    if (!validation.success) {
      console.error("Validation errors:", validation.errors?.format());
      return NextResponse.json(
        {
          error: "Invalid config",
          details: validation.errors?.format() || "Unknown validation error"
        },
        { status: 400 }
      );
    }

    // Use validated config
    const validatedConfig = validation.data || config;

    // Check database connection before saving
    try {
      // Test database connection
      await prisma.$connect();
    } catch (dbConnectionError) {
      console.error("Database connection error:", dbConnectionError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: "Please check your DATABASE_URL environment variable and ensure the database is accessible.",
          ...(dbConnectionError instanceof Error && { message: dbConnectionError.message })
        },
        { status: 500 }
      );
    }

    // Save config to database
    let submissionId: string;
    try {
      submissionId = await saveSubmission({
        config: validatedConfig,
        userEmail: validatedConfig.email,
        userName: validatedConfig.name,
        submittedBy: "anonymous", // Could get from session if auth enabled
      });
    } catch (dbError) {
      console.error("Database save error:", dbError);
      throw new Error(`Failed to save submission to database: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
    }

    // Handle assets
    const assets: { file: File; type: 'about' | 'project' | 'avatar' | 'hero'; index?: number; alt?: string }[] = [];

    // Extract about image
    const aboutImage = formData.get("aboutImage") as File | null;
    const aboutImageAlt = formData.get("aboutImageAlt") as string | null;
    if (aboutImage && aboutImage.size > 0) {
      assets.push({
        file: aboutImage,
        type: 'about',
        alt: aboutImageAlt || undefined
      });
    }

    // Extract project images
    let projectIndex = 0;
    while (formData.has(`projectImage-${projectIndex}`)) {
      const projectImage = formData.get(`projectImage-${projectIndex}`) as File;
      const projectImageAlt = formData.get(`projectImageAlt-${projectIndex}`) as string | null;
      if (projectImage && projectImage.size > 0) {
        assets.push({
          file: projectImage,
          type: 'project',
          index: projectIndex,
          alt: projectImageAlt || undefined
        });
      }
      projectIndex++;
    }

    // Save assets to Supabase Storage and database (if assets exist)
    let savedAssets = [];

    if (assets.length > 0) {
      if (!supabaseAdmin) {
        console.error("Supabase Storage not configured");
        return NextResponse.json(
          { error: "Supabase Storage not configured. Please set SUPABASE_SERVICE_ROLE_KEY in environment variables." },
          { status: 500 }
        );
      }

      for (const asset of assets) {
        const timestamp = Date.now();
        const extension = asset.file.name.split('.').pop() || 'jpg';
        const filename = `${asset.type}-${asset.index !== undefined ? `${asset.index}-` : ''}${timestamp}.${extension}`;
        const filePath = `${submissionId}/${filename}`; // Organize by submission ID

        // Convert File to Buffer
        const buffer = Buffer.from(await asset.file.arrayBuffer());

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('submissions')
          .upload(filePath, buffer, {
            contentType: asset.file.type,
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload ${filename}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('submissions')
          .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        // Save asset metadata to database
        const dbAsset = await saveAsset({
          submissionId,
          filename,
          filePath: publicUrl, // Store Supabase URL instead of local path
          assetType: asset.type,
          projectIndex: asset.index,
          altText: asset.alt,
        });

        savedAssets.push(dbAsset);
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: "Submission saved successfully",
      assetsCount: savedAssets.length,
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: "Failed to save submission",
        details: errorMessage,
        ...(errorStack && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}

