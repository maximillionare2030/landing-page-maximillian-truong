import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import type { SiteConfig, ThemeId, LayoutId } from "../../../types/site";

// Validation schemas (duplicated from lib/validate.ts for CLI use)
const themeIdSchema = z.enum(["noir", "neon-noir", "slate-pop"]);
const layoutIdSchema = z.enum(["classic", "timeline", "compact"]);

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

const experienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().optional(),
  bullets: z.array(z.string().min(1)).min(1, "At least one bullet point is required"),
});

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  image: z.string().min(1, "Project image is required"),
  alt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url("Invalid URL"),
      })
    )
    .optional(),
});

const siteConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  socials: z
    .object({
      github: z.string().url("Invalid GitHub URL").optional(),
      linkedin: z.string().url("Invalid LinkedIn URL").optional(),
      x: z.string().url("Invalid X/Twitter URL").optional(),
      website: z.string().url("Invalid website URL").optional(),
      email: z.string().email("Invalid email").optional(),
      other: z.string().url("Invalid URL").optional(),
    })
    .optional(),
  theme: z.object({
    id: themeIdSchema,
    brandHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
    darkMode: z.boolean().optional(),
  }),
  layout: layoutIdSchema,
  images: z
    .object({
      avatar: z.string().optional(),
      hero: z.string().optional(),
    })
    .optional(),
  about: z.object({
    bio: z.string().min(1, "Bio is required"),
    image: z.string().optional(),
    alt: z.string().optional(),
  }),
  skills: z.array(skillSchema).min(1, "At least one skill is required"),
  experience: z.array(experienceSchema).min(1, "At least one experience is required"),
  portfolio: z.array(projectSchema).min(1, "At least one project is required"),
});

function validateSiteConfig(data: unknown): {
  success: boolean;
  data?: SiteConfig;
  errors?: z.ZodError;
} {
  const result = siteConfigSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Read and validate config file
 */
export function readConfig(configPath: string): {
  success: boolean;
  config?: SiteConfig;
  error?: string;
} {
  try {
    const configContent = readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(configContent);
    const validation = validateSiteConfig(parsed);

    if (!validation.success) {
      return {
        success: false,
        error: `Config validation failed: ${JSON.stringify(validation.errors?.format(), null, 2)}`,
      };
    }

    return {
      success: true,
      config: validation.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to read config file",
    };
  }
}

/**
 * Update image paths in config to use /uploads prefix
 */
export function updateImagePaths(config: SiteConfig, assetsDir: string): SiteConfig {
  // This is handled in fs.ts copyAssets function
  return config;
}
