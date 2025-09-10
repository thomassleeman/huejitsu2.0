import chroma from "chroma-js";

/**
 * WCAG contrast ratio calculation utilities using chroma-js
 * Provides precise contrast ratio calculations following WCAG 2.1 guidelines
 */

/**
 * Calculate WCAG contrast ratio between two colors
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color's luminance
 * @param foreground - Foreground color in any valid CSS format
 * @param background - Background color in any valid CSS format
 * @returns Contrast ratio (1:1 to 21:1)
 */
export function calculateContrast(
  foreground: string,
  background: string
): number {
  try {
    return chroma.contrast(foreground, background);
  } catch (error) {
    console.warn(
      `Invalid color formats for contrast calculation: ${foreground}, ${background}`
    );
    return 1; // Worst possible contrast
  }
}

/**
 * Get contrast ratio with specific requirements
 * @param level - WCAG compliance level
 * @param isLargeText - Whether the text is considered large (18pt+ or 14pt+ bold)
 * @returns Required minimum contrast ratio
 */
export function getContrastRequirement(
  level: "AA" | "AAA",
  isLargeText: boolean
): number {
  if (level === "AAA") {
    return isLargeText ? 4.5 : 7;
  } else {
    return isLargeText ? 3 : 4.5;
  }
}

/**
 * Check if color pair meets WCAG AA compliance
 * AA Level: 4.5:1 for normal text, 3:1 for large text
 * @param foreground - Foreground color
 * @param background - Background color
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns Whether the color pair meets AA compliance
 */
export function checkAACompliance(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrast(foreground, background);
  const requirement = getContrastRequirement("AA", isLargeText);
  return ratio >= requirement;
}

/**
 * Check if color pair meets WCAG AAA compliance
 * AAA Level: 7:1 for normal text, 4.5:1 for large text
 * @param foreground - Foreground color
 * @param background - Background color
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns Whether the color pair meets AAA compliance
 */
export function checkAAACompliance(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrast(foreground, background);
  const requirement = getContrastRequirement("AAA", isLargeText);
  return ratio >= requirement;
}

/**
 * Get compliance level for a color pair
 * @param foreground - Foreground color
 * @param background - Background color
 * @param isLargeText - Whether text is large
 * @returns Compliance level achieved
 */
export function getComplianceLevel(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): "AAA" | "AA" | "fail" {
  if (checkAAACompliance(foreground, background, isLargeText)) {
    return "AAA";
  } else if (checkAACompliance(foreground, background, isLargeText)) {
    return "AA";
  } else {
    return "fail";
  }
}

/**
 * Find the optimal text color (black or white) for a given background
 * @param backgroundColor - Background color
 * @returns '#000000' or '#FFFFFF' depending on which provides better contrast
 */
export function getOptimalTextColor(backgroundColor: string): string {
  const blackContrast = calculateContrast("#000000", backgroundColor);
  const whiteContrast = calculateContrast("#FFFFFF", backgroundColor);

  return blackContrast > whiteContrast ? "#000000" : "#FFFFFF";
}

/**
 * Adjust a foreground color to meet minimum contrast requirements
 * @param foreground - Original foreground color
 * @param background - Background color
 * @param targetRatio - Desired contrast ratio (default: 4.5 for AA)
 * @param maxIterations - Maximum adjustment attempts (default: 50)
 * @returns Adjusted color that meets contrast requirements, or original if adjustment fails
 */
export function adjustForContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5,
  maxIterations: number = 50
): string {
  try {
    let adjustedColor = chroma(foreground);
    let currentRatio = calculateContrast(adjustedColor.hex(), background);

    if (currentRatio >= targetRatio) {
      return adjustedColor.hex(); // Already meets requirements
    }

    const backgroundLuminance = chroma(background).luminance();
    const shouldDarken = backgroundLuminance > 0.5;

    for (let i = 0; i < maxIterations; i++) {
      if (shouldDarken) {
        adjustedColor = adjustedColor.darken(0.1);
      } else {
        adjustedColor = adjustedColor.brighten(0.1);
      }

      currentRatio = calculateContrast(adjustedColor.hex(), background);

      if (currentRatio >= targetRatio) {
        return adjustedColor.hex();
      }

      // Prevent infinite loops at extreme values
      const luminance = adjustedColor.luminance();
      if (luminance <= 0.01 || luminance >= 0.99) {
        break;
      }
    }

    // If adjustment fails, return optimal black or white
    return getOptimalTextColor(background);
  } catch (error) {
    console.warn(
      `Failed to adjust color for contrast: ${foreground} on ${background}`
    );
    return foreground;
  }
}

/**
 * Generate a color palette with guaranteed contrast compliance
 * @param baseColor - Base color to derive palette from
 * @param level - WCAG compliance level to target
 * @param themePreference - Optional theme preference for background generation
 * @returns Object with background, text, and accent colors that meet contrast requirements
 */
export function generateAccessiblePalette(
  baseColor: string,
  level: "AA" | "AAA" = "AA",
  themePreference?: "light" | "dark"
): {
  background: string;
  text: string;
  accent: string;
  muted: string;
  border: string;
} {
  try {
    const base = chroma(baseColor);
    const isLightBase = base.luminance() > 0.5;

    // Generate background based on theme preference
    let background: string;
    if (themePreference === "light") {
      // Force light background (L > 85 in HSL)
      const baseHsl = base.hsl();
      const lightBackground = chroma.hsl(
        baseHsl[0] || 0,
        Math.min(baseHsl[1] || 0, 0.1),
        Math.max(0.85, 0.95)
      );
      background = lightBackground.hex();
    } else if (themePreference === "dark") {
      // Force dark background (L < 25 in HSL)
      const baseHsl = base.hsl();
      const darkBackground = chroma.hsl(
        baseHsl[0] || 0,
        Math.min(baseHsl[1] || 0, 0.1),
        Math.min(0.25, 0.05)
      );
      background = darkBackground.hex();
    } else {
      // Use current behavior (best accessible regardless of lightness)
      background = isLightBase
        ? chroma.mix(base, "#ffffff", 0.95).hex()
        : chroma.mix(base, "#000000", 0.95).hex();
    }

    // Generate text with proper contrast
    const textColor = getOptimalTextColor(background);
    const text = adjustForContrast(
      textColor,
      background,
      getContrastRequirement(level, false)
    );

    // Generate accent color that works with background
    const accent = adjustForContrast(
      baseColor,
      background,
      getContrastRequirement(level, false)
    );

    // Generate muted and border colors
    const muted = chroma.mix(background, text, 0.1).hex();
    const border = chroma.mix(background, text, 0.2).hex();

    return {
      background,
      text,
      accent,
      muted,
      border,
    };
  } catch (error) {
    console.warn(`Failed to generate accessible palette from: ${baseColor}`);
    return {
      background: "#ffffff",
      text: "#000000",
      accent: baseColor,
      muted: "#f5f5f5",
      border: "#e5e5e5",
    };
  }
}
