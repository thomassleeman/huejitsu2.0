import chroma from "chroma-js";
import { getLuminance } from "./color-converter";

/**
 * Contrast calculation utilities using chroma-js
 * Implements WCAG contrast ratio calculations and accessibility checks
 */

export interface ContrastResult {
  ratio: number;
  level: "AA" | "AAA" | "fail";
  isLargeText?: boolean;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 guidelines
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  try {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.warn(`Error calculating contrast ratio: ${error}`);
    return 1;
  }
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsAAContrast(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(color1, color2);
  return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsAAAContrast(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(color1, color2);
  return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
}

/**
 * Get contrast level classification
 */
export function getContrastLevel(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): ContrastResult {
  const ratio = calculateContrastRatio(color1, color2);

  let level: "AA" | "AAA" | "fail" = "fail";

  if (meetsAAAContrast(color1, color2, isLargeText)) {
    level = "AAA";
  } else if (meetsAAContrast(color1, color2, isLargeText)) {
    level = "AA";
  }

  return {
    ratio,
    level,
    isLargeText,
  };
}

/**
 * Find the best contrast color (black or white) for a given background
 */
export function getBestContrastColor(backgroundColor: string): string {
  const blackContrast = calculateContrastRatio(backgroundColor, "#000000");
  const whiteContrast = calculateContrastRatio(backgroundColor, "#FFFFFF");

  return blackContrast > whiteContrast ? "#000000" : "#FFFFFF";
}

/**
 * Generate accessible text color for a given background
 */
export function getAccessibleTextColor(
  backgroundColor: string,
  preferredColor?: string
): string {
  if (preferredColor && meetsAAContrast(backgroundColor, preferredColor)) {
    return preferredColor;
  }

  return getBestContrastColor(backgroundColor);
}

/**
 * Adjust color lightness to meet minimum contrast requirements
 */
export function adjustForContrast(
  color: string,
  backgroundColor: string,
  targetRatio: number = 4.5
): string {
  try {
    let adjustedColor = chroma(color);
    let currentRatio = calculateContrastRatio(
      adjustedColor.hex(),
      backgroundColor
    );

    // If contrast is already good, return original color
    if (currentRatio >= targetRatio) {
      return adjustedColor.hex();
    }

    // Determine if we need to lighten or darken
    const bgLuminance = getLuminance(backgroundColor);
    const shouldLighten = bgLuminance < 0.5;

    // Adjust in small steps until we meet the target ratio
    const maxSteps = 20;
    const stepSize = shouldLighten ? 0.1 : -0.1;

    for (let i = 0; i < maxSteps; i++) {
      adjustedColor = shouldLighten
        ? adjustedColor.brighten(0.1)
        : adjustedColor.darken(0.1);

      currentRatio = calculateContrastRatio(
        adjustedColor.hex(),
        backgroundColor
      );

      if (currentRatio >= targetRatio) {
        break;
      }
    }

    return adjustedColor.hex();
  } catch (error) {
    console.warn(`Error adjusting color for contrast: ${error}`);
    return color;
  }
}

/**
 * Generate a palette of colors that all meet contrast requirements with a given background
 */
export function generateAccessiblePalette(
  backgroundColor: string,
  baseColors: string[],
  targetRatio: number = 4.5
): string[] {
  return baseColors.map((color) =>
    adjustForContrast(color, backgroundColor, targetRatio)
  );
}

/**
 * Check if a color palette has sufficient contrast between colors
 */
export function validatePaletteContrast(
  colors: string[],
  minRatio: number = 3.0
): {
  isValid: boolean;
  issues: Array<{ color1: string; color2: string; ratio: number }>;
} {
  const issues: Array<{ color1: string; color2: string; ratio: number }> = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const ratio = calculateContrastRatio(colors[i], colors[j]);
      if (ratio < minRatio) {
        issues.push({
          color1: colors[i],
          color2: colors[j],
          ratio,
        });
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Calculate relative luminance according to WCAG 2.1
 * This is a more precise implementation using chroma-js
 */
export function getRelativeLuminance(color: string): number {
  try {
    return chroma(color).luminance();
  } catch (error) {
    console.warn(`Error calculating relative luminance: ${error}`);
    return 0;
  }
}

/**
 * Generate semantic colors with proper contrast for accessibility
 */
export function generateSemanticColors(backgroundColor: string): {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
} {
  const baseColors = {
    primary: "#3B82F6",
    secondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
  };

  return {
    primary: adjustForContrast(baseColors.primary, backgroundColor),
    secondary: adjustForContrast(baseColors.secondary, backgroundColor),
    success: adjustForContrast(baseColors.success, backgroundColor),
    warning: adjustForContrast(baseColors.warning, backgroundColor),
    error: adjustForContrast(baseColors.error, backgroundColor),
    info: adjustForContrast(baseColors.info, backgroundColor),
  };
}
