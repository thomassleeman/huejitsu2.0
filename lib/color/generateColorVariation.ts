import type { ColorSystem } from "@/types/design-system";
import {
  generateColorScheme,
  getRandomHue,
  COLOR_SCHEMES,
  type ColorSchemeType,
} from "./harmony-algorithms";

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

  // Create background and text colors with better logic
  const isLightTheme = Math.random() > 0.3; // 70% light themes
  const defaultBackground = isLightTheme ? "#FFFFFF" : "#0F172A";
  const defaultText = isLightTheme ? "#0F172A" : "#F8FAFC";

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
  const background =
    options.pinnedBackground && currentColors
      ? currentColors.background
      : defaultBackground;
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
      muted: isLightTheme ? "#F1F5F9" : "#334155",
      border: isLightTheme ? "#E2E8F0" : "#475569",
    },
  };

  return result;
}

export function getRandomColorVariation(): ColorSystem {
  return generateColorVariation();
}
