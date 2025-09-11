import chroma from "chroma-js";
import {
  COLOR_CONFIG,
  getContrastRequirement as getConfigContrastRequirement,
} from "./color-config";

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
  // Input validation
  if (
    !foreground ||
    typeof foreground !== "string" ||
    !background ||
    typeof background !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for calculateContrast", {
        foreground,
        background,
      });
    }
    return 1; // Minimum contrast ratio
  }

  try {
    const contrast = chroma.contrast(foreground, background);

    // Validate result
    if (isNaN(contrast) || !isFinite(contrast) || contrast < 1) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid contrast result", {
          foreground,
          background,
          contrast,
        });
      }
      return 1;
    }

    return contrast;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] calculateContrast failed:", error);
      console.warn("[ColorSystem] Input params:", { foreground, background });
    }
    return 1; // Minimum contrast ratio as fallback
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
  // Input validation
  if (!level || (level !== "AA" && level !== "AAA")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid level for getContrastRequirement",
        level
      );
    }
    level = "AA";
  }

  if (typeof isLargeText !== "boolean") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid isLargeText for getContrastRequirement",
        isLargeText
      );
    }
    isLargeText = false;
  }

  try {
    if (level === "AAA") {
      return isLargeText
        ? COLOR_CONFIG.contrastRequirements.AAA.large
        : COLOR_CONFIG.contrastRequirements.AAA.normal;
    } else {
      return isLargeText
        ? COLOR_CONFIG.contrastRequirements.AA.large
        : COLOR_CONFIG.contrastRequirements.AA.normal;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getContrastRequirement failed:", error);
      console.warn("[ColorSystem] Input params:", { level, isLargeText });
    }
    return 4.5; // Safe fallback for AA normal text
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
  // Input validation
  if (
    !foreground ||
    typeof foreground !== "string" ||
    !background ||
    typeof background !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for checkAACompliance", {
        foreground,
        background,
      });
    }
    return false;
  }

  if (typeof isLargeText !== "boolean") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid isLargeText for checkAACompliance",
        isLargeText
      );
    }
    isLargeText = false;
  }

  try {
    const ratio = calculateContrast(foreground, background);
    const requirement = getContrastRequirement("AA", isLargeText);

    // Validate calculations
    if (
      isNaN(ratio) ||
      !isFinite(ratio) ||
      isNaN(requirement) ||
      !isFinite(requirement)
    ) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid calculation results in checkAACompliance",
          { ratio, requirement }
        );
      }
      return false;
    }

    return ratio >= requirement;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] checkAACompliance failed:", error);
      console.warn("[ColorSystem] Input params:", {
        foreground,
        background,
        isLargeText,
      });
    }
    return false;
  }
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
  // Input validation
  if (
    !foreground ||
    typeof foreground !== "string" ||
    !background ||
    typeof background !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for checkAAACompliance", {
        foreground,
        background,
      });
    }
    return false;
  }

  if (typeof isLargeText !== "boolean") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid isLargeText for checkAAACompliance",
        isLargeText
      );
    }
    isLargeText = false;
  }

  try {
    const ratio = calculateContrast(foreground, background);
    const requirement = getContrastRequirement("AAA", isLargeText);

    // Validate calculations
    if (
      isNaN(ratio) ||
      !isFinite(ratio) ||
      isNaN(requirement) ||
      !isFinite(requirement)
    ) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid calculation results in checkAAACompliance",
          { ratio, requirement }
        );
      }
      return false;
    }

    return ratio >= requirement;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] checkAAACompliance failed:", error);
      console.warn("[ColorSystem] Input params:", {
        foreground,
        background,
        isLargeText,
      });
    }
    return false;
  }
}

/**
 * Check WCAG compliance levels
 * @param foreground - Foreground color
 * @param background - Background color
 * @param level - WCAG compliance level ('AA' | 'AAA')
 * @param largeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns Whether the color pair meets the specified compliance level
 */
export function checkWCAGCompliance(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  largeText: boolean = false
): boolean {
  // Input validation
  if (
    !foreground ||
    typeof foreground !== "string" ||
    !background ||
    typeof background !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for checkWCAGCompliance", {
        foreground,
        background,
      });
    }
    return false;
  }

  if (!level || (level !== "AA" && level !== "AAA")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid level for checkWCAGCompliance",
        level
      );
    }
    level = "AA";
  }

  if (typeof largeText !== "boolean") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid largeText for checkWCAGCompliance",
        largeText
      );
    }
    largeText = false;
  }

  try {
    const ratio = calculateContrast(foreground, background);

    // Validate ratio
    if (isNaN(ratio) || !isFinite(ratio)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid ratio in checkWCAGCompliance",
          ratio
        );
      }
      return false;
    }

    if (level === "AA") {
      return largeText ? ratio >= 3 : ratio >= 4.5;
    } else {
      // AAA
      return largeText ? ratio >= 4.5 : ratio >= 7;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] checkWCAGCompliance failed:", error);
      console.warn("[ColorSystem] Input params:", {
        foreground,
        background,
        level,
        largeText,
      });
    }
    return false;
  }
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
  // Input validation
  if (
    !foreground ||
    typeof foreground !== "string" ||
    !background ||
    typeof background !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for getComplianceLevel", {
        foreground,
        background,
      });
    }
    return "fail";
  }

  if (typeof isLargeText !== "boolean") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid isLargeText for getComplianceLevel",
        isLargeText
      );
    }
    isLargeText = false;
  }

  try {
    if (checkAAACompliance(foreground, background, isLargeText)) {
      return "AAA";
    } else if (checkAACompliance(foreground, background, isLargeText)) {
      return "AA";
    } else {
      return "fail";
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getComplianceLevel failed:", error);
      console.warn("[ColorSystem] Input params:", {
        foreground,
        background,
        isLargeText,
      });
    }
    return "fail";
  }
}

/**
 * Get perceptual color difference
 * @param color1 - First color
 * @param color2 - Second color
 * @param mode - Color space for distance calculation ('lab' | 'rgb' | 'hsl')
 * @returns Perceptual distance between colors
 */
export function getColorDistance(
  color1: string,
  color2: string,
  mode: "lab" | "rgb" | "hsl" = "lab"
): number {
  // Input validation
  if (
    !color1 ||
    typeof color1 !== "string" ||
    !color2 ||
    typeof color2 !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for getColorDistance", {
        color1,
        color2,
      });
    }
    return 0;
  }

  if (!mode || (mode !== "lab" && mode !== "rgb" && mode !== "hsl")) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid mode for getColorDistance", mode);
    }
    mode = "lab";
  }

  try {
    // Use LAB space for perceptual difference by default
    const distance = chroma.distance(color1, color2, mode);

    // Validate result
    if (isNaN(distance) || !isFinite(distance)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid distance result", {
          color1,
          color2,
          mode,
          distance,
        });
      }
      return 0;
    }

    return distance;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getColorDistance failed:", error);
      console.warn("[ColorSystem] Input params:", { color1, color2, mode });
    }
    return 0;
  }
}

/**
 * Get luminance using chroma-js
 * @param color - Color to get luminance for
 * @returns Luminance value (0-1)
 */
export function getLuminance(color: string): number {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for getLuminance", color);
    }
    return 0;
  }

  try {
    const luminance = chroma(color).luminance();

    // Validate result
    if (isNaN(luminance) || !isFinite(luminance)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid luminance result", {
          color,
          luminance,
        });
      }
      return 0;
    }

    return luminance;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getLuminance failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return 0;
  }
}

/**
 * Improve foreground color to meet contrast requirements
 * @param foreground - Original foreground color
 * @param background - Background color
 * @param targetRatio - Target contrast ratio (default: 4.5)
 * @returns Improved foreground color that meets contrast requirements
 */
export function improveContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string {
  // Input validation
  if (
    !foreground ||
    typeof foreground !== "string" ||
    !background ||
    typeof background !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for improveContrast", {
        foreground,
        background,
      });
    }
    return foreground || "#000000";
  }

  if (
    typeof targetRatio !== "number" ||
    isNaN(targetRatio) ||
    !isFinite(targetRatio) ||
    targetRatio <= 0
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid targetRatio for improveContrast",
        targetRatio
      );
    }
    targetRatio = 4.5;
  }

  try {
    const fg = chroma(foreground);
    const bg = chroma(background);
    const currentRatio = chroma.contrast(fg, bg);

    // Validate current ratio
    if (isNaN(currentRatio) || !isFinite(currentRatio)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid current ratio in improveContrast",
          currentRatio
        );
      }
      return foreground;
    }

    if (currentRatio >= targetRatio) {
      return foreground; // Already meets requirement
    }

    // Determine direction to adjust (lighter or darker)
    const bgLuminance = bg.luminance();

    // Validate luminance
    if (isNaN(bgLuminance) || !isFinite(bgLuminance)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid background luminance in improveContrast",
          bgLuminance
        );
      }
      return foreground;
    }

    const shouldDarken = bgLuminance > 0.5;

    // Adjust luminance to meet target
    let adjustedColor = fg;
    const step = 0.05;
    let iterations = 0;
    const maxIterations = 20;

    while (iterations < maxIterations) {
      try {
        const contrast = chroma.contrast(adjustedColor, bg);

        if (isNaN(contrast) || !isFinite(contrast)) {
          break;
        }

        if (contrast >= targetRatio) {
          break;
        }

        if (shouldDarken) {
          adjustedColor = adjustedColor.darken(step);
        } else {
          adjustedColor = adjustedColor.brighten(step);
        }

        // Check if we've reached extreme values
        const luminance = adjustedColor.luminance();
        if (isNaN(luminance) || luminance <= 0.01 || luminance >= 0.99) {
          break;
        }

        iterations++;
      } catch (iterationError) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[ColorSystem] Error in improveContrast iteration",
            iterationError
          );
        }
        break;
      }
    }

    return adjustedColor.hex();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] improveContrast failed:", error);
      console.warn("[ColorSystem] Input params:", {
        foreground,
        background,
        targetRatio,
      });
    }
    return foreground;
  }
}

/**
 * Find the optimal text color (black or white) for a given background
 * @param backgroundColor - Background color
 * @returns '#000000' or '#FFFFFF' depending on which provides better contrast
 */
export function getOptimalTextColor(backgroundColor: string): string {
  // Input validation
  if (!backgroundColor || typeof backgroundColor !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid backgroundColor for getOptimalTextColor",
        backgroundColor
      );
    }
    return "#000000";
  }

  try {
    const blackContrast = calculateContrast("#000000", backgroundColor);
    const whiteContrast = calculateContrast("#FFFFFF", backgroundColor);

    // Validate contrast calculations
    if (
      isNaN(blackContrast) ||
      isNaN(whiteContrast) ||
      !isFinite(blackContrast) ||
      !isFinite(whiteContrast)
    ) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid contrast calculations in getOptimalTextColor",
          { blackContrast, whiteContrast }
        );
      }
      // Fallback to luminance-based decision
      try {
        const luminance = chroma(backgroundColor).luminance();
        return luminance > 0.5 ? "#000000" : "#FFFFFF";
      } catch {
        return "#000000";
      }
    }

    return blackContrast > whiteContrast ? "#000000" : "#FFFFFF";
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getOptimalTextColor failed:", error);
      console.warn("[ColorSystem] Input params:", { backgroundColor });
    }
    return "#000000";
  }
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
  targetRatio: number = COLOR_CONFIG.contrastRequirements.AA.normal,
  maxIterations: number = COLOR_CONFIG.constraints.maxGenerationAttempts * 5
): string {
  // Input validation
  if (
    !foreground ||
    typeof foreground !== "string" ||
    !background ||
    typeof background !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for adjustForContrast", {
        foreground,
        background,
      });
    }
    return foreground || "#000000";
  }

  if (
    typeof targetRatio !== "number" ||
    isNaN(targetRatio) ||
    !isFinite(targetRatio) ||
    targetRatio <= 0
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid targetRatio for adjustForContrast",
        targetRatio
      );
    }
    targetRatio = COLOR_CONFIG.contrastRequirements.AA.normal;
  }

  if (
    typeof maxIterations !== "number" ||
    isNaN(maxIterations) ||
    !isFinite(maxIterations) ||
    maxIterations <= 0
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid maxIterations for adjustForContrast",
        maxIterations
      );
    }
    maxIterations = COLOR_CONFIG.constraints.maxGenerationAttempts * 5;
  }

  try {
    let adjustedColor = chroma(foreground);
    let currentRatio = calculateContrast(adjustedColor.hex(), background);

    // Validate initial ratio
    if (isNaN(currentRatio) || !isFinite(currentRatio)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid initial ratio in adjustForContrast",
          currentRatio
        );
      }
      return getOptimalTextColor(background);
    }

    if (currentRatio >= targetRatio) {
      return adjustedColor.hex(); // Already meets requirements
    }

    const backgroundLuminance = chroma(background).luminance();

    // Validate background luminance
    if (isNaN(backgroundLuminance) || !isFinite(backgroundLuminance)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid background luminance in adjustForContrast",
          backgroundLuminance
        );
      }
      return getOptimalTextColor(background);
    }

    const shouldDarken =
      backgroundLuminance >
      COLOR_CONFIG.textColors.backgroundLuminanceThreshold;

    // Clamp maxIterations to reasonable range
    maxIterations = Math.max(1, Math.min(100, Math.floor(maxIterations)));

    for (let i = 0; i < maxIterations; i++) {
      try {
        if (shouldDarken) {
          adjustedColor = adjustedColor.darken(
            COLOR_CONFIG.harmonyDefaults.lightness.variation
          );
        } else {
          adjustedColor = adjustedColor.brighten(
            COLOR_CONFIG.harmonyDefaults.lightness.variation
          );
        }

        currentRatio = calculateContrast(adjustedColor.hex(), background);

        // Validate current ratio
        if (isNaN(currentRatio) || !isFinite(currentRatio)) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[ColorSystem] Invalid ratio during adjustment iteration",
              i,
              currentRatio
            );
          }
          break;
        }

        if (currentRatio >= targetRatio) {
          return adjustedColor.hex();
        }

        // Prevent infinite loops at extreme values
        const luminance = adjustedColor.luminance();
        if (
          isNaN(luminance) ||
          !isFinite(luminance) ||
          luminance <= 0.01 ||
          luminance >= 0.99
        ) {
          break;
        }
      } catch (iterationError) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[ColorSystem] Error in adjustForContrast iteration",
            i,
            iterationError
          );
        }
        break;
      }
    }

    // If adjustment fails, return optimal black or white
    return getOptimalTextColor(background);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] adjustForContrast failed:", error);
      console.warn("[ColorSystem] Input params:", {
        foreground,
        background,
        targetRatio,
        maxIterations,
      });
    }
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
  // Input validation
  if (!baseColor || typeof baseColor !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseColor for generateAccessiblePalette",
        baseColor
      );
    }
    baseColor = "#3B82F6";
  }

  if (!level || (level !== "AA" && level !== "AAA")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid level for generateAccessiblePalette",
        level
      );
    }
    level = "AA";
  }

  if (
    themePreference &&
    themePreference !== "light" &&
    themePreference !== "dark"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid themePreference for generateAccessiblePalette",
        themePreference
      );
    }
    themePreference = undefined;
  }

  try {
    // Generate background using the new generateBackgroundFromBase function
    let background: string;

    try {
      if (themePreference === "light") {
        background = generateBackgroundFromBase(
          baseColor,
          "light",
          COLOR_CONFIG
        );
      } else if (themePreference === "dark") {
        background = generateBackgroundFromBase(
          baseColor,
          "dark",
          COLOR_CONFIG
        );
      } else {
        // Random: choose theme randomly and generate
        const randomTheme = Math.random() > 0.5 ? "light" : "dark";
        background = generateBackgroundFromBase(
          baseColor,
          randomTheme,
          COLOR_CONFIG
        );
      }
    } catch (bgError) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate background, using fallback",
          bgError
        );
      }
      background = themePreference === "dark" ? "#1a1b1e" : "#ffffff";
    }

    // Generate text with proper contrast
    let text: string;
    try {
      const textColor = getOptimalTextColor(background);
      text = adjustForContrast(
        textColor,
        background,
        getConfigContrastRequirement(level, false)
      );
    } catch (textError) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate text color, using fallback",
          textError
        );
      }
      text = getOptimalTextColor(background);
    }

    // Generate accent color that works with background
    let accent: string;
    try {
      accent = adjustForContrast(
        baseColor,
        background,
        getConfigContrastRequirement(level, false)
      );
    } catch (accentError) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate accent color, using fallback",
          accentError
        );
      }
      accent = baseColor;
    }

    // Generate muted and border colors using configuration
    let muted: string;
    let border: string;

    try {
      muted = chroma
        .mix(background, text, COLOR_CONFIG.paletteVariations.muted.alphaValue)
        .hex();
    } catch (mutedError) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate muted color, using fallback",
          mutedError
        );
      }
      muted = "#f5f5f5";
    }

    try {
      const isLightBackground =
        chroma(background).luminance() >
        COLOR_CONFIG.textColors.backgroundLuminanceThreshold;
      const borderRatio = isLightBackground
        ? Math.abs(COLOR_CONFIG.paletteVariations.border.lightnessShift.light)
        : COLOR_CONFIG.paletteVariations.border.lightnessShift.dark;
      border = chroma.mix(background, text, borderRatio).hex();
    } catch (borderError) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate border color, using fallback",
          borderError
        );
      }
      border = "#e5e5e5";
    }

    return {
      background,
      text,
      accent,
      muted,
      border,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateAccessiblePalette failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseColor,
        level,
        themePreference,
      });
    }
    return {
      background: "#ffffff",
      text: "#000000",
      accent: baseColor || "#3B82F6",
      muted: "#f5f5f5",
      border: "#e5e5e5",
    };
  }
}

/**
 * Generate a background color with subtle tinting based on a base color
 * @param baseColor - The base color to derive the background from (hex string)
 * @param themePreference - Whether to generate a light or dark background ('light' | 'dark')
 * @param config - Configuration object containing the ranges (from color-config.ts)
 * @returns Hex color string for the background
 */
export function generateBackgroundFromBase(
  baseColor: string,
  themePreference: "light" | "dark",
  config: typeof COLOR_CONFIG
): string {
  // Input validation
  if (!baseColor || typeof baseColor !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseColor for generateBackgroundFromBase",
        baseColor
      );
    }
    return themePreference === "light" ? "#f8f9fa" : "#1a1b1e";
  }

  if (
    !themePreference ||
    (themePreference !== "light" && themePreference !== "dark")
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid themePreference for generateBackgroundFromBase",
        themePreference
      );
    }
    themePreference = "light";
  }

  if (!config || typeof config !== "object") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid config for generateBackgroundFromBase",
        config
      );
    }
    return themePreference === "light" ? "#f8f9fa" : "#1a1b1e";
  }

  try {
    // Extract the hue from baseColor using chroma-js
    const baseChroma = chroma(baseColor);
    const baseHsl = baseChroma.hsl();
    let originalHue = baseHsl[0];

    // Handle greyscale colors (no hue) or invalid hue
    if (
      isNaN(originalHue) ||
      originalHue === null ||
      originalHue === undefined ||
      !isFinite(originalHue)
    ) {
      originalHue = Math.random() * 360; // Use random hue for grey base colors
    }

    // Validate and normalize originalHue
    originalHue = ((originalHue % 360) + 360) % 360;

    // Apply hue variation: ±10 degrees randomly
    const hueVariation = Math.random() * 20 - 10; // ±10 degrees
    let adjustedHue = originalHue + hueVariation;

    // Handle hue wrapping (keep between 0-360)
    adjustedHue = ((adjustedHue % 360) + 360) % 360;

    // Get theme-specific configuration
    const themeConfig = config.backgroundThemes[themePreference];

    if (!themeConfig || typeof themeConfig !== "object") {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid theme config for generateBackgroundFromBase",
          themeConfig
        );
      }
      return themePreference === "light" ? "#f8f9fa" : "#1a1b1e";
    }

    // Generate random values within the configured ranges with validation
    let saturation: number;
    let lightness: number;

    try {
      saturation =
        themeConfig.saturation.min +
        Math.random() *
          (themeConfig.saturation.max - themeConfig.saturation.min);

      // Validate and clamp saturation
      if (isNaN(saturation) || !isFinite(saturation)) {
        saturation = themeConfig.saturation.default || 0.1;
      } else {
        saturation = Math.max(0, Math.min(1, saturation));
      }
    } catch (satError) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Error calculating saturation", satError);
      }
      saturation = themeConfig.saturation.default || 0.1;
    }

    try {
      lightness =
        themeConfig.lightness.min +
        Math.random() * (themeConfig.lightness.max - themeConfig.lightness.min);

      // Validate and clamp lightness
      if (isNaN(lightness) || !isFinite(lightness)) {
        lightness =
          themeConfig.lightness.default ||
          (themePreference === "light" ? 0.9 : 0.1);
      } else {
        lightness = Math.max(0, Math.min(1, lightness));
      }
    } catch (lightError) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Error calculating lightness", lightError);
      }
      lightness =
        themeConfig.lightness.default ||
        (themePreference === "light" ? 0.9 : 0.1);
    }

    // Create the color using chroma.hsl() with the calculated values
    const backgroundColor = chroma.hsl(adjustedHue, saturation, lightness);

    const result = backgroundColor.hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid background color generated");
    }

    // Return the hex value
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateBackgroundFromBase failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseColor,
        themePreference,
        config,
      });
    }
    // Return appropriate fallback based on theme
    return themePreference === "light" ? "#f8f9fa" : "#1a1b1e";
  }
}
