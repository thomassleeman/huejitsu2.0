import chroma from "chroma-js";
import type { ColorSystem } from "@/types/design-system";
import type { ColorSchemeType } from "./harmony-algorithms";

/**
 * Analysis result for pinned color relationships
 */
export interface ColorRelationshipAnalysis {
  pinnedColors: Array<{
    key: keyof ColorSystem;
    color: string;
    hue: number;
  }>;
  relationships: Array<{
    color1: string;
    color2: string;
    hue1: number;
    hue2: number;
    angleDifference: number;
  }>;
  constraints: {
    hasMonochromaticConstraint: boolean;
    hasComplementaryConstraint: boolean;
    hasTriadicConstraint: boolean;
    hasTetradicConstraint: boolean;
    hasAnalogousConstraint: boolean;
    hasSplitComplementaryConstraint: boolean;
  };
}

/**
 * Result of harmony compatibility check
 */
export interface HarmonyCompatibilityResult {
  isCompatible: boolean;
  reason?: string;
  educationalTooltip?: string;
}

/**
 * Calculate the hue angle between two colors in degrees (0-360)
 */
export function calculateColorAngle(color1: string, color2: string): number {
  try {
    const hue1 = chroma(color1).get("hsl.h") || 0;
    const hue2 = chroma(color2).get("hsl.h") || 0;

    // Calculate the shortest angular distance
    let diff = Math.abs(hue2 - hue1);
    if (diff > 180) {
      diff = 360 - diff;
    }

    return diff;
  } catch (error) {
    console.warn("Error calculating color angle:", error);
    return 0;
  }
}

/**
 * Get the hue of a color in degrees (0-360)
 */
export function getColorHue(color: string): number {
  try {
    return chroma(color).get("hsl.h") || 0;
  } catch (error) {
    console.warn("Error getting color hue:", error);
    return 0;
  }
}

/**
 * Analyze relationships between pinned colors
 */
export function analyzeColorRelationships(
  colors: ColorSystem,
  pinningState: { colors: Record<string, boolean> }
): ColorRelationshipAnalysis {
  // Define the color keys that are strings (exclude palette)
  const colorKeys: (keyof ColorSystem)[] = [
    "primary",
    "secondary",
    "accent",
    "background",
    "text",
  ];

  // Get pinned colors with their hues
  const pinnedColors = colorKeys
    .filter((key) => pinningState.colors[key])
    .map((key) => {
      const color = colors[key];
      if (typeof color === "string") {
        return {
          key,
          color,
          hue: getColorHue(color),
        };
      }
      return null;
    })
    .filter(
      (item): item is { key: keyof ColorSystem; color: string; hue: number } =>
        item !== null
    );

  // Calculate relationships between all pinned color pairs
  const relationships = [];
  for (let i = 0; i < pinnedColors.length; i++) {
    for (let j = i + 1; j < pinnedColors.length; j++) {
      const color1 = pinnedColors[i];
      const color2 = pinnedColors[j];
      const angleDifference = calculateColorAngle(color1.color, color2.color);

      relationships.push({
        color1: color1.color,
        color2: color2.color,
        hue1: color1.hue,
        hue2: color2.hue,
        angleDifference,
      });
    }
  }

  // Determine constraints based on relationships
  const constraints = {
    hasMonochromaticConstraint: relationships.some(
      (r) => r.angleDifference > 30
    ),
    hasComplementaryConstraint: relationships.some(
      (r) => Math.abs(r.angleDifference - 180) > 20
    ),
    hasTriadicConstraint: relationships.some(
      (r) =>
        Math.abs(r.angleDifference - 120) > 20 &&
        Math.abs(r.angleDifference - 240) > 20
    ),
    hasTetradicConstraint: relationships.some(
      (r) =>
        Math.abs(r.angleDifference - 90) > 20 &&
        Math.abs(r.angleDifference - 180) > 20 &&
        Math.abs(r.angleDifference - 270) > 20
    ),
    hasAnalogousConstraint: relationships.some((r) => r.angleDifference > 60),
    hasSplitComplementaryConstraint: relationships.some(
      (r) =>
        Math.abs(r.angleDifference - 150) > 20 &&
        Math.abs(r.angleDifference - 210) > 20
    ),
  };

  return {
    pinnedColors,
    relationships,
    constraints,
  };
}

/**
 * Check if a specific harmony type is compatible with pinned colors
 */
export function isHarmonyCompatible(
  harmonyType: ColorSchemeType,
  analysis: ColorRelationshipAnalysis
): HarmonyCompatibilityResult {
  // If no colors are pinned, all harmonies are compatible
  if (analysis.pinnedColors.length === 0) {
    return { isCompatible: true };
  }

  // If only one color is pinned, all harmonies are compatible
  if (analysis.pinnedColors.length === 1) {
    return { isCompatible: true };
  }

  const { constraints, relationships } = analysis;

  switch (harmonyType) {
    case "monochromatic":
      if (constraints.hasMonochromaticConstraint) {
        return {
          isCompatible: false,
          reason: "Pinned colors are too far apart for monochromatic harmony",
          educationalTooltip:
            "Monochromatic schemes use variations of a single hue. Your pinned colors span multiple hues on the color wheel.",
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Monochromatic schemes create harmony through variations in lightness and saturation of a single hue.",
      };

    case "complementary":
      if (constraints.hasComplementaryConstraint) {
        const problematicRelationship = relationships.find(
          (r) => Math.abs(r.angleDifference - 180) > 20
        );
        return {
          isCompatible: false,
          reason: "Pinned colors don't form complementary relationships",
          educationalTooltip: `Complementary colors sit directly opposite each other on the color wheel (180° apart). Your pinned colors are ${problematicRelationship?.angleDifference.toFixed(
            0
          )}° apart.`,
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Complementary colors create vibrant contrast by using colors from opposite sides of the color wheel.",
      };

    case "triadic":
      if (constraints.hasTriadicConstraint) {
        return {
          isCompatible: false,
          reason: "Pinned colors don't form triadic relationships",
          educationalTooltip:
            "Triadic schemes use three colors evenly spaced around the color wheel (120° apart). Your pinned colors don't fit this pattern.",
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Triadic schemes create balanced, vibrant palettes using three colors equally spaced on the color wheel.",
      };

    case "tetradic":
      if (constraints.hasTetradicConstraint) {
        return {
          isCompatible: false,
          reason: "Pinned colors don't form tetradic relationships",
          educationalTooltip:
            "Tetradic (rectangle) schemes use four colors forming two complementary pairs. Your pinned colors don't fit this geometric pattern.",
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Tetradic schemes offer rich color variety using four colors that form a rectangle on the color wheel.",
      };

    case "analogous":
      if (constraints.hasAnalogousConstraint) {
        const problematicRelationship = relationships.find(
          (r) => r.angleDifference > 60
        );
        return {
          isCompatible: false,
          reason: "Pinned colors are too far apart for analogous harmony",
          educationalTooltip: `Analogous colors are adjacent on the color wheel (typically within 60°). Your pinned colors are ${problematicRelationship?.angleDifference.toFixed(
            0
          )}° apart.`,
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Analogous schemes create serene, comfortable designs using colors that sit next to each other on the color wheel.",
      };

    case "split-complementary":
      if (constraints.hasSplitComplementaryConstraint) {
        return {
          isCompatible: false,
          reason: "Pinned colors don't form split-complementary relationships",
          educationalTooltip:
            "Split-complementary schemes use a base color plus the two colors adjacent to its complement (150° and 210° from the base). Your pinned colors don't fit this pattern.",
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Split-complementary schemes offer high contrast like complementary colors but with less tension, using a base color plus two colors adjacent to its complement.",
      };

    default:
      return { isCompatible: true };
  }
}

/**
 * Get all compatible harmony types for the current pinned colors
 */
export function getCompatibleHarmonies(
  analysis: ColorRelationshipAnalysis
): ColorSchemeType[] {
  const allHarmonies: ColorSchemeType[] = [
    "monochromatic",
    "analogous",
    "complementary",
    "triadic",
    "tetradic",
    "split-complementary",
  ];

  return allHarmonies.filter(
    (harmony) => isHarmonyCompatible(harmony, analysis).isCompatible
  );
}

/**
 * Generate educational tooltip content for a harmony type
 */
export function generateHarmonyTooltip(
  harmonyType: ColorSchemeType,
  analysis: ColorRelationshipAnalysis
): string {
  const compatibilityResult = isHarmonyCompatible(harmonyType, analysis);

  if (compatibilityResult.educationalTooltip) {
    return compatibilityResult.educationalTooltip;
  }

  // Fallback descriptions
  const descriptions: Record<ColorSchemeType, string> = {
    monochromatic:
      "Uses variations of a single hue for harmonious, calming designs.",
    analogous:
      "Uses colors adjacent on the color wheel for naturally pleasing combinations.",
    complementary:
      "Uses opposite colors for high contrast and vibrant designs.",
    triadic: "Uses three evenly spaced colors for balanced, lively palettes.",
    tetradic:
      "Uses four colors in rectangle formation for rich, diverse schemes.",
    "split-complementary":
      "Uses a base color plus two adjacent to its complement for softer contrast.",
  };

  return descriptions[harmonyType] || "";
}

/**
 * Generate incompatibility reason for disabled harmony options
 */
export function generateIncompatibilityReason(
  harmonyType: ColorSchemeType,
  analysis: ColorRelationshipAnalysis
): string {
  const compatibilityResult = isHarmonyCompatible(harmonyType, analysis);
  return (
    compatibilityResult.reason ||
    "This harmony type is not compatible with your pinned colors."
  );
}
