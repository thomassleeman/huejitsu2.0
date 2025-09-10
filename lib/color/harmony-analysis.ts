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
  patternCompatibility: {
    monochromatic: boolean;
    complementary: boolean;
    triadic: boolean;
    tetradic: boolean;
    analogous: boolean;
    splitComplementary: boolean;
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
 * Returns the shortest angular distance
 */
export function calculateColorAngle(color1: string, color2: string): number {
  try {
    const hue1 = chroma(color1).get("hsl.h") || 0;
    const hue2 = chroma(color2).get("hsl.h") || 0;
    return calculateHueDistance(hue1, hue2);
  } catch (error) {
    console.warn("Error calculating color angle:", error);
    return 0;
  }
}

/**
 * Calculate the shortest angular distance between two hues (0-360)
 * Handles wraparound at 0°/360° boundary correctly
 */
export function calculateHueDistance(hue1: number, hue2: number): number {
  let diff = Math.abs(hue2 - hue1);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Get the hue range (min to max) of an array of hues
 * Handles wraparound correctly (e.g., [350, 10] has range 20, not 340)
 */
export function getHueRange(hues: number[]): number {
  if (hues.length <= 1) return 0;

  // Sort hues
  const sortedHues = [...hues].sort((a, b) => a - b);

  // Check if it's more efficient to wrap around
  const directRange = sortedHues[sortedHues.length - 1] - sortedHues[0];
  const wrapAroundRange = 360 - directRange;

  return Math.min(directRange, wrapAroundRange);
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
 * Pattern detection functions for each harmony type
 * These functions determine if a set of pinned colors can form a valid harmony pattern
 */

/**
 * Check if pinned colors can form a monochromatic pattern
 * All colors should be within ~30° of each other
 */
export function canFormMonochromaticPattern(
  pinnedColors: Array<{ hue: number }>
): boolean {
  if (pinnedColors.length === 0) return true;
  const hues = pinnedColors.map((c) => c.hue);
  const range = getHueRange(hues);
  return range <= 30;
}

/**
 * Check if pinned colors can form a complementary pattern
 * Colors should form complementary pairs (180° apart)
 */
export function canFormComplementaryPattern(
  pinnedColors: Array<{ hue: number }>
): boolean {
  if (pinnedColors.length <= 1) return true;
  if (pinnedColors.length === 2) {
    // Two colors should be approximately 180° apart
    const distance = calculateHueDistance(
      pinnedColors[0].hue,
      pinnedColors[1].hue
    );
    return Math.abs(distance - 180) <= 20;
  }
  // For more than 2 colors, check if they can form complementary pairs
  const hues = pinnedColors.map((c) => c.hue);
  return hues.every((hue1) =>
    hues.some((hue2) => {
      if (hue1 === hue2) return true; // Same hue
      const distance = calculateHueDistance(hue1, hue2);
      return Math.abs(distance - 180) <= 20; // Has complement
    })
  );
}

/**
 * Check if pinned colors can form a triadic pattern
 * Three colors evenly spaced (120° apart)
 */
export function canFormTriadicPattern(
  pinnedColors: Array<{ hue: number }>
): boolean {
  if (pinnedColors.length <= 1) return true;
  if (pinnedColors.length === 2) {
    // Two colors can be part of triadic if they're 120° or 240° apart
    const distance = calculateHueDistance(
      pinnedColors[0].hue,
      pinnedColors[1].hue
    );
    return Math.abs(distance - 120) <= 20 || Math.abs(distance - 240) <= 20;
  }
  if (pinnedColors.length === 3) {
    // Check if three colors form a valid triadic pattern
    const hues = pinnedColors.map((c) => c.hue).sort((a, b) => a - b);
    const distances = [
      calculateHueDistance(hues[0], hues[1]),
      calculateHueDistance(hues[1], hues[2]),
      calculateHueDistance(hues[0], hues[2]),
    ];

    // In a perfect triadic, we should have two ~120° distances and one ~240° distance
    const validDistances = distances.filter(
      (d) => Math.abs(d - 120) <= 20 || Math.abs(d - 240) <= 20
    );
    return validDistances.length >= 2;
  }
  // For more than 3 colors, check if any subset of 3 can form triadic
  const hues = pinnedColors.map((c) => c.hue);
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      for (let k = j + 1; k < hues.length; k++) {
        const subset = [{ hue: hues[i] }, { hue: hues[j] }, { hue: hues[k] }];
        if (canFormTriadicPattern(subset)) return true;
      }
    }
  }
  return false;
}

/**
 * Check if pinned colors can form a tetradic pattern
 * Four colors forming a rectangle (90° spacing)
 */
export function canFormTetradicPattern(
  pinnedColors: Array<{ hue: number }>
): boolean {
  if (pinnedColors.length <= 1) return true;
  if (pinnedColors.length === 2) {
    // Two colors can be part of tetradic if they're 90° or 180° apart
    const distance = calculateHueDistance(
      pinnedColors[0].hue,
      pinnedColors[1].hue
    );
    return Math.abs(distance - 90) <= 20 || Math.abs(distance - 180) <= 20;
  }
  if (pinnedColors.length === 3) {
    // Check if three colors can be part of a tetradic pattern
    const hues = pinnedColors.map((c) => c.hue);
    const distances = [];
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        distances.push(calculateHueDistance(hues[i], hues[j]));
      }
    }
    // Should have some 90° or 180° relationships
    return distances.some(
      (d) => Math.abs(d - 90) <= 20 || Math.abs(d - 180) <= 20
    );
  }
  if (pinnedColors.length === 4) {
    // Check if four colors form a valid tetradic pattern
    const hues = pinnedColors.map((c) => c.hue).sort((a, b) => a - b);
    const distances = [];
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        distances.push(calculateHueDistance(hues[i], hues[j]));
      }
    }
    // In tetradic, we should have 90°, 180°, and 270° relationships
    const validDistances = distances.filter(
      (d) =>
        Math.abs(d - 90) <= 20 ||
        Math.abs(d - 180) <= 20 ||
        Math.abs(d - 270) <= 20
    );
    return validDistances.length >= 3;
  }
  // For more than 4 colors, check if any subset of 4 can form tetradic
  return true; // Be permissive for complex cases
}

/**
 * Check if pinned colors can form an analogous pattern
 * Colors adjacent on color wheel (within 60° span)
 */
export function canFormAnalogousPattern(
  pinnedColors: Array<{ hue: number }>
): boolean {
  if (pinnedColors.length === 0) return true;
  const hues = pinnedColors.map((c) => c.hue);
  const range = getHueRange(hues);
  return range <= 60;
}

/**
 * Check if pinned colors can form a split-complementary pattern
 * Base color + two colors adjacent to its complement (150° and 210° from base)
 */
export function canFormSplitComplementaryPattern(
  pinnedColors: Array<{ hue: number }>
): boolean {
  if (pinnedColors.length <= 1) return true;
  if (pinnedColors.length === 2) {
    // Two colors can be part of split-complementary if they're ~150° or ~210° apart
    const distance = calculateHueDistance(
      pinnedColors[0].hue,
      pinnedColors[1].hue
    );
    return (
      Math.abs(distance - 150) <= 20 ||
      Math.abs(distance - 210) <= 20 ||
      Math.abs(distance - 60) <= 20
    );
  }
  if (pinnedColors.length === 3) {
    // Check if three colors can form split-complementary
    const hues = pinnedColors.map((c) => c.hue);
    const distances = [];
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        distances.push(calculateHueDistance(hues[i], hues[j]));
      }
    }
    // Should have relationships around 60°, 150°, or 210°
    return distances.some(
      (d) =>
        Math.abs(d - 60) <= 20 ||
        Math.abs(d - 150) <= 20 ||
        Math.abs(d - 210) <= 20
    );
  }
  // For more colors, be permissive
  return true;
}

/**
 * Analyze relationships between pinned colors using pattern-based compatibility
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

  // Determine pattern compatibility using new pattern detection functions
  const patternCompatibility = {
    monochromatic: canFormMonochromaticPattern(pinnedColors),
    complementary: canFormComplementaryPattern(pinnedColors),
    triadic: canFormTriadicPattern(pinnedColors),
    tetradic: canFormTetradicPattern(pinnedColors),
    analogous: canFormAnalogousPattern(pinnedColors),
    splitComplementary: canFormSplitComplementaryPattern(pinnedColors),
  };

  return {
    pinnedColors,
    relationships,
    patternCompatibility,
  };
}

/**
 * Check if a specific harmony type is compatible with pinned colors
 * Uses pattern-based compatibility instead of constraint-based logic
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

  const { patternCompatibility, relationships, pinnedColors } = analysis;

  switch (harmonyType) {
    case "monochromatic":
      if (!patternCompatibility.monochromatic) {
        const hues = pinnedColors.map((c) => c.hue);
        const range = getHueRange(hues);
        return {
          isCompatible: false,
          reason: `Pinned colors span ${range.toFixed(
            0
          )}° which is too wide for monochromatic harmony`,
          educationalTooltip:
            "Monochromatic schemes use variations of a single hue (within ~30°). Your pinned colors span multiple hues on the color wheel.",
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Monochromatic schemes create harmony through variations in lightness and saturation of a single hue.",
      };

    case "complementary":
      if (!patternCompatibility.complementary) {
        return {
          isCompatible: false,
          reason: "Pinned colors cannot form valid complementary pairs",
          educationalTooltip:
            "Complementary colors sit directly opposite each other on the color wheel (180° apart). Your pinned colors don't form complementary relationships.",
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Complementary colors create vibrant contrast by using colors from opposite sides of the color wheel.",
      };

    case "triadic":
      if (!patternCompatibility.triadic) {
        return {
          isCompatible: false,
          reason: "Pinned colors cannot form a valid triadic pattern",
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
      if (!patternCompatibility.tetradic) {
        return {
          isCompatible: false,
          reason: "Pinned colors cannot form a valid tetradic pattern",
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
      if (!patternCompatibility.analogous) {
        const hues = pinnedColors.map((c) => c.hue);
        const range = getHueRange(hues);
        return {
          isCompatible: false,
          reason: `Pinned colors span ${range.toFixed(
            0
          )}° which is too wide for analogous harmony`,
          educationalTooltip:
            "Analogous colors are adjacent on the color wheel (typically within 60°). Your pinned colors span too wide a range.",
        };
      }
      return {
        isCompatible: true,
        educationalTooltip:
          "Analogous schemes create serene, comfortable designs using colors that sit next to each other on the color wheel.",
      };

    case "split-complementary":
      if (!patternCompatibility.splitComplementary) {
        return {
          isCompatible: false,
          reason:
            "Pinned colors cannot form a valid split-complementary pattern",
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
