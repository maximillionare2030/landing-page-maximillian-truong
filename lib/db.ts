import { PrismaClient } from '@prisma/client';
import type { SiteConfig } from '@/types/site';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

interface SaveSubmissionParams {
  config: SiteConfig;
  userEmail?: string;
  userName: string;
  submittedBy?: string;
}

export async function saveSubmission(params: SaveSubmissionParams) {
  try {
    const submission = await prisma.submission.create({
      data: {
        userName: params.userName,
        email: params.userEmail,
        config: params.config as any, // JSON
        submittedBy: params.submittedBy || 'anonymous',
        status: 'pending',
      },
    });

    return submission.id;
  } catch (error) {
    console.error("Prisma saveSubmission error:", error);
    throw error;
  }
}

interface SaveAssetParams {
  submissionId: string;
  filename: string;
  filePath: string;
  assetType: 'about' | 'project' | 'skill' | 'experience' | 'avatar' | 'hero' | 'favicon';
  projectIndex?: number;
  altText?: string;
}

export async function saveAsset(params: SaveAssetParams) {
  try {
    const asset = await prisma.submissionAsset.create({
      data: {
        submissionId: params.submissionId,
        filename: params.filename,
        filePath: params.filePath,
        assetType: params.assetType,
        projectIndex: params.projectIndex ?? null,
        altText: params.altText,
      },
    });

    return asset;
  } catch (error) {
    console.error("Prisma saveAsset error:", error);
    throw error;
  }
}

export async function getSubmissionWithAssets(id: string) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      assets: true,
    },
  });

  if (!submission) return null;

  // Reconstruct config with asset URLs
  const config = submission.config as SiteConfig;

  // Map assets back to config
  const aboutAsset = submission.assets.find(a => a.assetType === 'about');
  if (aboutAsset) {
    config.about.image = aboutAsset.filePath;
    config.about.alt = aboutAsset.altText || '';
  }

  // Map project images
  submission.assets
    .filter(a => a.assetType === 'project')
    .forEach(asset => {
      if (asset.projectIndex !== null && config.portfolio[asset.projectIndex]) {
        config.portfolio[asset.projectIndex].image = asset.filePath;
        config.portfolio[asset.projectIndex].alt = asset.altText || '';
      }
    });

  // Map skill images
  submission.assets
    .filter(a => a.assetType === 'skill')
    .forEach(asset => {
      if (asset.projectIndex !== null && config.skills[asset.projectIndex]) {
        config.skills[asset.projectIndex].image = asset.filePath;
      }
    });

  // Map avatar and hero images if present
  const avatarAsset = submission.assets.find(a => a.assetType === 'avatar');
  if (avatarAsset && config.images) {
    config.images.avatar = avatarAsset.filePath;
  }

  const heroAsset = submission.assets.find(a => a.assetType === 'hero');
  if (heroAsset && config.images) {
    config.images.hero = heroAsset.filePath;
  }

  return {
    id: submission.id,
    config,
    status: submission.status,
    userName: submission.userName,
    email: submission.email,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    assets: submission.assets,
  };
}

export async function listSubmissions(limit = 50, status?: string) {
  const where = status ? { status } : {};

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      assets: {
        select: {
          id: true,
          filename: true,
          filePath: true,
          assetType: true,
        },
      },
    },
  });

  return submissions;
}

