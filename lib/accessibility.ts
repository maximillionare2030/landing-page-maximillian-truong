import { meetsAAContrast } from "./themes";

/**
 * Check if text color meets WCAG AA contrast with background
 */
export function checkTextContrast(
  textColor: string,
  backgroundColor: string,
  isLargeText = false
): { passes: boolean; ratio: number; required: number } {
  const required = isLargeText ? 3 : 4.5;
  const passes = meetsAAContrast(textColor, backgroundColor, isLargeText);

  // Calculate actual ratio
  const ratio = calculateContrastRatio(textColor, backgroundColor);

  return { passes, ratio, required };
}

/**
 * Calculate contrast ratio between two hex colors
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.slice(0, 2), 16);
  const g1 = parseInt(hex1.slice(2, 4), 16);
  const b1 = parseInt(hex1.slice(4, 6), 16);

  const r2 = parseInt(hex2.slice(0, 2), 16);
  const g2 = parseInt(hex2.slice(2, 4), 16);
  const b2 = parseInt(hex2.slice(4, 6), 16);

  const lum1 = getRelativeLuminance(r1, g1, b1);
  const lum2 = getRelativeLuminance(r2, g2, b2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Validate that all required ARIA attributes are present
 */
export function validateARIA(element: HTMLElement): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  // Check for required ARIA on interactive elements
  if (
    element.hasAttribute("aria-label") ||
    element.hasAttribute("aria-labelledby") ||
    element.textContent?.trim()
  ) {
    // Has some form of label
  } else if (
    ["button", "a", "input", "select", "textarea"].includes(
      element.tagName.toLowerCase()
    )
  ) {
    missing.push("aria-label or aria-labelledby");
  }

  // Check images for alt text
  if (element.tagName.toLowerCase() === "img") {
    const img = element as HTMLImageElement;
    if (!img.alt && !img.hasAttribute("aria-label")) {
      missing.push("alt text or aria-label");
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check keyboard navigation support
 */
export function checkKeyboardNavigation(element: HTMLElement): {
  navigable: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  const tabIndex = element.tabIndex;
  const isInteractive =
    element.tagName.toLowerCase() in
    ["button", "a", "input", "select", "textarea"];

  if (tabIndex < 0 && isInteractive && !element.hasAttribute("disabled")) {
    issues.push("Interactive element should be keyboard accessible");
  }

  if (tabIndex > 0) {
    issues.push("Tab index should be 0 or -1, not positive");
  }

  return {
    navigable: issues.length === 0,
    issues,
  };
}

