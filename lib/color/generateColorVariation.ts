import type { ColorSystem } from "@/types/design-system";
import {
  generateColorScheme,
  getRandomHue,
  COLOR_SCHEMES,
  type ColorSchemeType,
} from "./harmony-algorithms";
import { isLight, mix } from "./color-converter";
import {
  generateAccessiblePalette,
  adjustForContrast,
} from "./contrast-calculator";

export interface ColorVariationOptions {
  pinnedPrimary?: boolean;
  pinnedSecondary?: boolean;
  pinnedAccent?: boolean;
  pinnedBackground?: boolean;
  pinnedText?: boolean;
  colorScheme?: ColorSchemeType;
  baseHue?: number;
}

export function generateColorVariation(
  currentColors?: ColorSystem,
  options: ColorVariationOptions = {}
): ColorSystem {
  // Determine base hue and scheme
  const baseHue = options.baseHue ?? getRandomHue();
  const scheme =
    options.colorScheme ??
    COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];

  // Generate base color scheme using new harmony algorithms
  const schemeColors = generateColorScheme(baseHue, scheme);

  // Create background and text colors using chroma-js with intelligent theme detection
  const baseColor = schemeColors[0];
  const shouldUseLightTheme = Math.random() > 0.3; // 70% light themes preference

  // Generate accessible background color that harmonizes with the color scheme
  const accessiblePalette = generateAccessiblePalette(baseColor, "AA");

  // Determine actual theme based on generated colors and preference
  const isLightTheme = shouldUseLightTheme
    ? isLight(accessiblePalette.background)
    : !isLight(accessiblePalette.background);

  // If the preference doesn't match the accessible palette, adjust
  const defaultBackground = isLightTheme
    ? isLight(accessiblePalette.background)
      ? accessiblePalette.background
      : mix(baseColor, "#ffffff", 0.95)
    : !isLight(accessiblePalette.background)
    ? accessiblePalette.background
    : mix(baseColor, "#000000", 0.95);

  // Determine preferred text color based on theme for softer appearance
  const preferredTextColor = isLightTheme
    ? "#111827" // Dark gray for light backgrounds
    : "#f8fafc"; // Light gray for dark backgrounds

  // Determine the actual background that will be used (respecting pinning)
  const actualBackground =
    options.pinnedBackground && currentColors
      ? currentColors.background
      : defaultBackground;

  // Use adjustForContrast to make it accessible while preserving aesthetics
  // This function will either return the adjusted color or fall back to black/white if necessary
  const defaultText = adjustForContrast(
    preferredTextColor,
    actualBackground, // Use the actual background (pinned or generated)
    4.5 // WCAG AA compliance
  );

  // Apply pinning logic while creating the result
  const primary =
    options.pinnedPrimary && currentColors
      ? currentColors.primary
      : schemeColors[0];
  const secondary =
    options.pinnedSecondary && currentColors
      ? currentColors.secondary
      : schemeColors[1];
  const accent =
    options.pinnedAccent && currentColors
      ? currentColors.accent
      : schemeColors[2];
  const background = actualBackground;
  const text =
    options.pinnedText && currentColors ? currentColors.text : defaultText;

  const result: ColorSystem = {
    primary,
    secondary,
    accent,
    background,
    text,
    palette: {
      primary,
      secondary,
      accent,
      background,
      text,
      muted: generateMutedColor(background, text),
      border: generateBorderColor(background, text),
    },
  };

  return result;
}

export function getRandomColorVariation(): ColorSystem {
  return generateColorVariation();
}

/**
 * Generate a muted color that works well with the background and text
 * @param background - Background color
 * @param text - Text color
 * @returns Muted color for UI elements
 */
function generateMutedColor(background: string, text: string): string {
  try {
    // Create a subtle variation of the background
    return mix(background, text, 0.05);
  } catch {
    console.warn("Failed to generate muted color, using fallback");
    return isLight(background) ? "#F1F5F9" : "#334155";
  }
}

/**
 * Generate a border color that provides subtle definition
 * @param background - Background color
 * @param text - Text color
 * @returns Border color for UI elements
 */
function generateBorderColor(background: string, text: string): string {
  try {
    // Create a more pronounced but still subtle variation
    return mix(background, text, 0.15);
  } catch {
    console.warn("Failed to generate border color, using fallback");
    return isLight(background) ? "#E2E8F0" : "#475569";
  }
}
