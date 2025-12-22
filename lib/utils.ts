import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Slugify a string for use in URLs and filenames
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Generate repo name from first and last name
 */
export function generateRepoName(firstName: string, lastName: string): string {
  const first = slugify(firstName);
  const last = slugify(lastName);
  return `landing-page-${first}-${last}`;
}

/**
 * Handle repo name collisions by appending -1, -2, etc.
 */
export function handleRepoCollision(baseName: string, existingNames: string[]): string {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }

  let counter = 1;
  let candidate = `${baseName}-${counter}`;
  while (existingNames.includes(candidate)) {
    counter++;
    candidate = `${baseName}-${counter}`;
  }
  return candidate;
}

/**
 * Resize and compress image on client side
 */
export async function processImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            const dataUrl = canvas.toDataURL(`image/${file.type.split("/")[1] || "jpeg"}`, quality);
            resolve({ blob, dataUrl });
          },
          file.type || "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate image file type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return validTypes.includes(file.type);
}

/**
 * Normalize image path for Next.js Image component
 * Converts paths like "assets/filename.png" to "/assets/filename.png"
 * Also ensures paths start with "/" for relative paths
 */
export function normalizeImagePath(path: string | undefined | null): string | undefined {
  if (!path || path.trim() === "" || path === "uploaded") {
    return undefined;
  }

  // If it's already a data URL or absolute URL, return as is
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If it starts with "/", return as is
  if (path.startsWith("/")) {
    return path;
  }

  // If it starts with "assets/", convert to "/assets/" for Next.js public folder
  if (path.startsWith("assets/")) {
    const filename = path.replace("assets/", "");
    return `/assets/${filename}`;
  }

  // Otherwise, add leading slash
  return `/${path}`;
}

