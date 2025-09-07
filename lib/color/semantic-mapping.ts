import chroma from "chroma-js";
import type { ColorSystem } from "@/types/design-system";
import {
  calculateContrast,
  checkAACompliance,
  getOptimalTextColor,
  adjustForContrast,
  generateAccessiblePalette,
} from "./contrast-calculator";
// Removed unused imports

/**
 * Semantic color mapping utilities
 * Assigns harmony colors to semantic roles with optimal contrast and usability
 */

export interface SemanticColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ColorRolePreferences {
  preferLightTheme?: boolean;
  emphasizePrimary?: boolean;
  highContrast?: boolean;
  colorfulAccents?: boolean;
}

export interface ColorRoleAssignment {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  rationale: string[];
}

export interface ColorSystemValidation {
  isValid: boolean;
  issues: ValidationIssue[];
  score: number; // 0-100
}

export interface ValidationIssue {
  type: "contrast" | "accessibility" | "harmony" | "usability";
  severity: "error" | "warning" | "info";
  message: string;
  colors: string[];
  suggestion?: string;
}

export interface ColorImprovement {
  type: "contrast" | "harmony" | "accessibility" | "usability";
  priority: "high" | "medium" | "low";
  description: string;
  currentValue: string;
  suggestedValue: string;
  impact: string;
}

/**
 * Generate semantic color palette from harmony colors
 * @param harmonyColors - Array of colors from color harmony algorithms
 * @param preferences - Optional preferences for color assignment
 * @returns Complete semantic color palette
 */
export function generateSemanticPalette(
  harmonyColors: string[],
  preferences: ColorRolePreferences = {}
): SemanticColorPalette {
  try {
    if (harmonyColors.length < 3) {
      throw new Error("Need at least 3 harmony colors for semantic palette");
    }

    // Theme preference influences palette generation but is applied in generateAccessiblePalette

    // Assign primary color (most vibrant or preferred)
    const primary = preferences.emphasizePrimary
      ? getMostVibrant(harmonyColors)
      : harmonyColors[0];

    // Generate base palette using the primary color
    const basePalette = generateAccessiblePalette(
      primary,
      preferences.highContrast ? "AAA" : "AA"
    );

    // Assign secondary and accent from remaining colors
    const remainingColors = harmonyColors.filter((color) => color !== primary);
    const secondary =
      remainingColors[0] || adjustColorForRole(primary, "secondary");
    const accent = remainingColors[1] || adjustColorForRole(primary, "accent");

    // Generate semantic state colors
    const semanticColors = generateSemanticStateColors(
      harmonyColors,
      basePalette.background
    );

    return {
      primary,
      secondary,
      accent,
      background: basePalette.background,
      text: basePalette.text,
      ...semanticColors,
    };
  } catch (error) {
    console.warn("Failed to generate semantic palette, using fallback:", error);
    return getFallbackSemanticPalette();
  }
}

/**
 * Assign harmony colors to semantic roles with optimal contrast
 * @param harmonyColors - Array of harmony colors
 * @param preferences - Color role preferences
 * @returns Color role assignment with rationale
 */
export function assignColorRoles(
  harmonyColors: string[],
  preferences: ColorRolePreferences = {}
): ColorRoleAssignment {
  try {
    const palette = generateSemanticPalette(harmonyColors, preferences);

    const rationale: string[] = [];

    // Analyze assignments and provide rationale
    const primaryLuminance = chroma(palette.primary).luminance();
    const contrast = calculateContrast(palette.primary, palette.background);

    rationale.push(
      `Primary color chosen for ${
        primaryLuminance > 0.5 ? "light" : "dark"
      } appearance`
    );
    rationale.push(
      `Background selected to provide ${contrast.toFixed(
        1
      )}:1 contrast with primary`
    );
    rationale.push(
      `Text color optimized for readability (${calculateContrast(
        palette.text,
        palette.background
      ).toFixed(1)}:1 contrast)`
    );

    if (preferences.highContrast) {
      rationale.push("High contrast mode enabled for enhanced accessibility");
    }

    return {
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background,
      text: palette.text,
      rationale,
    };
  } catch (error) {
    console.warn("Failed to assign color roles:", error);
    return {
      primary: harmonyColors[0] || "#3b82f6",
      secondary: harmonyColors[1] || "#64748b",
      accent: harmonyColors[2] || "#f59e0b",
      background: "#ffffff",
      text: "#000000",
      rationale: ["Using fallback color assignment due to error"],
    };
  }
}

/**
 * Validate that a color system meets basic usability requirements
 * @param colorSystem - Color system to validate
 * @returns Validation report with issues and score
 */
export function validateColorSystem(
  colorSystem: ColorSystem
): ColorSystemValidation {
  const issues: ValidationIssue[] = [];
  let score = 100;

  try {
    // Check contrast ratios
    const textBackgroundContrast = calculateContrast(
      colorSystem.text,
      colorSystem.background
    );
    if (textBackgroundContrast < 4.5) {
      issues.push({
        type: "contrast",
        severity: "error",
        message: `Text/background contrast ratio is too low: ${textBackgroundContrast.toFixed(
          1
        )}:1`,
        colors: [colorSystem.text, colorSystem.background],
        suggestion: "Increase contrast by adjusting text or background color",
      });
      score -= 30;
    } else if (textBackgroundContrast < 7) {
      issues.push({
        type: "contrast",
        severity: "warning",
        message: `Text/background contrast could be improved: ${textBackgroundContrast.toFixed(
          1
        )}:1`,
        colors: [colorSystem.text, colorSystem.background],
        suggestion: "Consider increasing contrast for AAA compliance",
      });
      score -= 10;
    }

    // Check primary color contrast
    const primaryBackgroundContrast = calculateContrast(
      colorSystem.primary,
      colorSystem.background
    );
    if (primaryBackgroundContrast < 3) {
      issues.push({
        type: "contrast",
        severity: "warning",
        message: `Primary color has low contrast with background: ${primaryBackgroundContrast.toFixed(
          1
        )}:1`,
        colors: [colorSystem.primary, colorSystem.background],
        suggestion: "Adjust primary color for better visibility",
      });
      score -= 15;
    }

    // Check color harmony
    const colors = [
      colorSystem.primary,
      colorSystem.secondary,
      colorSystem.accent,
    ];
    const harmonyScore = assessColorHarmony(colors);
    if (harmonyScore < 0.6) {
      issues.push({
        type: "harmony",
        severity: "info",
        message: "Colors may not work well together harmoniously",
        colors,
        suggestion: "Consider using colors with better harmonic relationships",
      });
      score -= 10;
    }

    // Check for sufficient color distinction
    const primarySecondaryDistance = chroma.deltaE(
      colorSystem.primary,
      colorSystem.secondary
    );
    if (primarySecondaryDistance < 15) {
      issues.push({
        type: "usability",
        severity: "warning",
        message: "Primary and secondary colors are too similar",
        colors: [colorSystem.primary, colorSystem.secondary],
        suggestion:
          "Increase visual distinction between primary and secondary colors",
      });
      score -= 15;
    }

    return {
      isValid:
        issues.filter((issue) => issue.severity === "error").length === 0,
      issues,
      score: Math.max(0, score),
    };
  } catch (error) {
    console.warn("Error validating color system:", error);
    return {
      isValid: false,
      issues: [
        {
          type: "accessibility",
          severity: "error",
          message: "Failed to validate color system",
          colors: Object.values(colorSystem),
          suggestion: "Check for valid color formats",
        },
      ],
      score: 0,
    };
  }
}

/**
 * Suggest improvements for better color role assignments
 * @param colorSystem - Current color system
 * @returns Array of improvement suggestions
 */
export function suggestColorImprovements(
  colorSystem: ColorSystem
): ColorImprovement[] {
  const improvements: ColorImprovement[] = [];

  try {
    const validation = validateColorSystem(colorSystem);

    // Convert validation issues to improvements
    for (const issue of validation.issues) {
      if (issue.type === "contrast" && issue.colors.length === 2) {
        const [foreground, background] = issue.colors;
        const adjustedColor = adjustForContrast(foreground, background, 4.5);

        improvements.push({
          type: "contrast",
          priority: issue.severity === "error" ? "high" : "medium",
          description: `Improve contrast ratio for better accessibility`,
          currentValue: foreground,
          suggestedValue: adjustedColor,
          impact: `Increases contrast from ${calculateContrast(
            foreground,
            background
          ).toFixed(1)}:1 to ${calculateContrast(
            adjustedColor,
            background
          ).toFixed(1)}:1`,
        });
      }
    }

    // Suggest color harmony improvements
    const harmonyScore = assessColorHarmony([
      colorSystem.primary,
      colorSystem.secondary,
      colorSystem.accent,
    ]);

    if (harmonyScore < 0.7) {
      const improvedSecondary = generateHarmoniousColor(
        colorSystem.primary,
        "complementary"
      );
      improvements.push({
        type: "harmony",
        priority: "medium",
        description:
          "Improve color harmony between primary and secondary colors",
        currentValue: colorSystem.secondary,
        suggestedValue: improvedSecondary,
        impact: "Creates better visual harmony and professional appearance",
      });
    }

    // Suggest accessibility improvements
    if (!checkAACompliance(colorSystem.text, colorSystem.background)) {
      const improvedText = getOptimalTextColor(colorSystem.background);
      improvements.push({
        type: "accessibility",
        priority: "high",
        description: "Improve text readability for WCAG AA compliance",
        currentValue: colorSystem.text,
        suggestedValue: improvedText,
        impact: "Ensures text is readable for users with visual impairments",
      });
    }

    return improvements;
  } catch (error) {
    console.warn("Error generating color improvements:", error);
    return [];
  }
}

// Helper functions

function getMostVibrant(colors: string[]): string {
  return colors.reduce((mostVibrant, color) => {
    const currentSaturation = chroma(color).get("hsl.s");
    const mostVibrantSaturation = chroma(mostVibrant).get("hsl.s");
    return currentSaturation > mostVibrantSaturation ? color : mostVibrant;
  });
}

function adjustColorForRole(
  baseColor: string,
  role: "secondary" | "accent"
): string {
  try {
    const base = chroma(baseColor);

    if (role === "secondary") {
      // Make secondary more muted
      return base.desaturate(0.3).hex();
    } else {
      // Make accent more vibrant and shift hue slightly
      return base
        .saturate(0.2)
        .set("hsl.h", (base.get("hsl.h") + 30) % 360)
        .hex();
    }
  } catch (error) {
    console.warn(`Failed to adjust color for role ${role}:`, error);
    return baseColor;
  }
}

function generateSemanticStateColors(
  harmonyColors: string[],
  backgroundColor: string
): Pick<SemanticColorPalette, "success" | "warning" | "error" | "info"> {
  try {
    // Use standard semantic color bases but adjust for contrast with background
    const baseSuccess = "#10b981"; // green
    const baseWarning = "#f59e0b"; // amber
    const baseError = "#ef4444"; // red
    const baseInfo = "#3b82f6"; // blue

    return {
      success: adjustForContrast(baseSuccess, backgroundColor, 3),
      warning: adjustForContrast(baseWarning, backgroundColor, 3),
      error: adjustForContrast(baseError, backgroundColor, 3),
      info: adjustForContrast(baseInfo, backgroundColor, 3),
    };
  } catch (error) {
    console.warn("Failed to generate semantic state colors:", error);
    return {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    };
  }
}

function assessColorHarmony(colors: string[]): number {
  try {
    if (colors.length < 2) return 1;

    let harmonyScore = 0;
    let comparisons = 0;

    // Check hue relationships
    for (let i = 0; i < colors.length - 1; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const hue1 = chroma(colors[i]).get("hsl.h");
        const hue2 = chroma(colors[j]).get("hsl.h");
        const hueDiff = Math.abs(hue1 - hue2);
        const normalizedDiff = Math.min(hueDiff, 360 - hueDiff);

        // Prefer complementary (180°), triadic (120°), or analogous (30°) relationships
        const harmoniousAngles = [30, 60, 90, 120, 150, 180];
        const closestHarmoniousAngle = harmoniousAngles.reduce(
          (closest, angle) => {
            return Math.abs(normalizedDiff - angle) <
              Math.abs(normalizedDiff - closest)
              ? angle
              : closest;
          }
        );

        const angleScore =
          1 - Math.abs(normalizedDiff - closestHarmoniousAngle) / 180;
        harmonyScore += angleScore;
        comparisons++;
      }
    }

    return comparisons > 0 ? harmonyScore / comparisons : 1;
  } catch (error) {
    console.warn("Error assessing color harmony:", error);
    return 0.5;
  }
}

function generateHarmoniousColor(
  baseColor: string,
  relationship: "complementary" | "triadic" | "analogous"
): string {
  try {
    const base = chroma(baseColor);
    const baseHue = base.get("hsl.h");

    let newHue: number;
    switch (relationship) {
      case "complementary":
        newHue = (baseHue + 180) % 360;
        break;
      case "triadic":
        newHue = (baseHue + 120) % 360;
        break;
      case "analogous":
        newHue = (baseHue + 30) % 360;
        break;
      default:
        newHue = baseHue;
    }

    return base.set("hsl.h", newHue).hex();
  } catch (error) {
    console.warn("Failed to generate harmonious color:", error);
    return baseColor;
  }
}

function getFallbackSemanticPalette(): SemanticColorPalette {
  return {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#000000",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  };
}
