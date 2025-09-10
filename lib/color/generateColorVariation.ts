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
import chroma from "chroma-js";

export interface ColorVariationOptions {
  pinnedPrimary?: boolean;
  pinnedSecondary?: boolean;
  pinnedAccent?: boolean;
  pinnedBackground?: boolean;
  pinnedText?: boolean;
  colorScheme?: ColorSchemeType;
  baseHue?: number;
  backgroundThemePreference?: "light" | "dark" | "random";
}

/**
 * Extract the hue from the first pinned color to use as base for harmony calculations
 */
function extractBaseHueFromPinnedColors(
  currentColors: ColorSystem,
  options: ColorVariationOptions
): number | null {
  // Priority order: primary, secondary, accent (background and text are less suitable for harmony base)
  if (options.pinnedPrimary && currentColors.primary) {
    try {
      return chroma(currentColors.primary).get("hsl.h") || 0;
    } catch {
      return null;
    }
  }
  if (options.pinnedSecondary && currentColors.secondary) {
    try {
      return chroma(currentColors.secondary).get("hsl.h") || 0;
    } catch {
      return null;
    }
  }
  if (options.pinnedAccent && currentColors.accent) {
    try {
      return chroma(currentColors.accent).get("hsl.h") || 0;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Determine which color positions need generation (are not pinned)
 */
function getUnpinnedPositions(options: ColorVariationOptions): {
  primary: boolean;
  secondary: boolean;
  accent: boolean;
} {
  return {
    primary: !options.pinnedPrimary,
    secondary: !options.pinnedSecondary,
    accent: !options.pinnedAccent,
  };
}

/**
 * Map harmony colors to their appropriate positions, respecting pinned colors
 */
function mapHarmonyToColorSystem(
  harmonyColors: string[],
  currentColors: ColorSystem | undefined,
  options: ColorVariationOptions
): { primary: string; secondary: string; accent: string } {
  const unpinned = getUnpinnedPositions(options);

  // If nothing is pinned, use harmony colors directly
  if (
    !currentColors ||
    (!options.pinnedPrimary &&
      !options.pinnedSecondary &&
      !options.pinnedAccent)
  ) {
    return {
      primary: harmonyColors[0],
      secondary: harmonyColors[1],
      accent: harmonyColors[2],
    };
  }

  // Build result preserving pinned colors
  const result = {
    primary:
      options.pinnedPrimary && currentColors?.primary
        ? currentColors.primary
        : harmonyColors[0],
    secondary:
      options.pinnedSecondary && currentColors?.secondary
        ? currentColors.secondary
        : harmonyColors[1],
    accent:
      options.pinnedAccent && currentColors?.accent
        ? currentColors.accent
        : harmonyColors[2],
  };

  // CRITICAL: If we have pinned colors, we need to map the harmony colors
  // to ONLY the unpinned positions while maintaining relationships
  let harmonyIndex = 0;
  const pinnedCount = [
    options.pinnedPrimary,
    options.pinnedSecondary,
    options.pinnedAccent,
  ].filter(Boolean).length;

  if (pinnedCount === 1) {
    // One color pinned: use remaining harmony colors for unpinned positions
    if (!options.pinnedPrimary && unpinned.primary) {
      result.primary = harmonyColors[1] || harmonyColors[0];
      harmonyIndex++;
    }
    if (!options.pinnedSecondary && unpinned.secondary) {
      result.secondary = harmonyColors[harmonyIndex + 1] || harmonyColors[1];
      harmonyIndex++;
    }
    if (!options.pinnedAccent && unpinned.accent) {
      result.accent = harmonyColors[harmonyIndex + 1] || harmonyColors[2];
    }
  } else if (pinnedCount === 2) {
    // Two colors pinned: use the one remaining harmony color for the unpinned position
    const unpinnedColor = harmonyColors[1] || harmonyColors[0];
    if (unpinned.primary) result.primary = unpinnedColor;
    if (unpinned.secondary) result.secondary = unpinnedColor;
    if (unpinned.accent) result.accent = unpinnedColor;
  }
  // If all 3 are pinned, we keep the pinned colors (already set above)

  return result;
}

export function generateColorVariation(
  currentColors?: ColorSystem,
  options: ColorVariationOptions = {}
): ColorSystem {
  // Determine base hue - use pinned color hue if available, otherwise use provided or random hue
  let baseHue: number;
  if (currentColors) {
    const pinnedHue = extractBaseHueFromPinnedColors(currentColors, options);
    baseHue = pinnedHue ?? options.baseHue ?? getRandomHue();
  } else {
    baseHue = options.baseHue ?? getRandomHue();
  }

  // Determine color scheme
  const scheme =
    options.colorScheme ??
    COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];

  // Generate harmony color scheme using the correct base hue
  const schemeColors = generateColorScheme(baseHue, scheme);

  // Map harmony colors to color system positions, respecting pinned colors
  const mappedColors = mapHarmonyToColorSystem(
    schemeColors,
    currentColors,
    options
  );

  // Create background and text colors using chroma-js with intelligent theme detection
  const baseColor = mappedColors.primary;

  // Determine theme preference based on user selection
  let shouldUseLightTheme: boolean;
  const themePreference = options.backgroundThemePreference || "random";

  if (themePreference === "light") {
    shouldUseLightTheme = true;
  } else if (themePreference === "dark") {
    shouldUseLightTheme = false;
  } else {
    // Random behavior - maintain current 70% light preference
    shouldUseLightTheme = Math.random() > 0.3;
  }

  // Generate accessible background color that harmonizes with the color scheme
  const accessiblePalette = generateAccessiblePalette(
    baseColor,
    "AA",
    themePreference !== "random" ? themePreference : undefined
  );

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

  // Use the mapped colors for main color positions
  const primary = mappedColors.primary;
  const secondary = mappedColors.secondary;
  const accent = mappedColors.accent;
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
