import type { ColorSystem } from "@/types/design-system";

// Color scheme types
const COLOR_SCHEMES = [
  "monochromatic",
  "analogous",
  "complementary",
  "triadic",
  "tetradic",
  "split-complementary",
] as const;

type ColorSchemeType = (typeof COLOR_SCHEMES)[number];

// Helper function to convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate random base hue
function getRandomHue(): number {
  return Math.floor(Math.random() * 360);
}

// Generate color scheme based on type and base hue
function generateColorScheme(
  baseHue: number,
  scheme: ColorSchemeType
): string[] {
  const saturation = 65 + Math.random() * 25; // 65-90%
  const baseLightness = 45 + Math.random() * 20; // 45-65%

  switch (scheme) {
    case "monochromatic":
      return [
        hslToHex(baseHue, saturation, baseLightness),
        hslToHex(baseHue, saturation * 0.7, baseLightness + 15),
        hslToHex(baseHue, saturation * 1.2, baseLightness - 15),
        hslToHex(baseHue, saturation * 0.5, baseLightness + 25),
      ];

    case "analogous":
      return [
        hslToHex(baseHue, saturation, baseLightness),
        hslToHex((baseHue + 30) % 360, saturation * 0.8, baseLightness + 10),
        hslToHex(
          (baseHue - 30 + 360) % 360,
          saturation * 0.9,
          baseLightness - 10
        ),
        hslToHex((baseHue + 60) % 360, saturation * 0.6, baseLightness + 20),
      ];

    case "complementary":
      return [
        hslToHex(baseHue, saturation, baseLightness),
        hslToHex((baseHue + 180) % 360, saturation * 0.8, baseLightness + 10),
        hslToHex(baseHue, saturation * 0.5, baseLightness + 25),
        hslToHex((baseHue + 180) % 360, saturation * 0.4, baseLightness + 30),
      ];

    case "triadic":
      return [
        hslToHex(baseHue, saturation, baseLightness),
        hslToHex((baseHue + 120) % 360, saturation * 0.8, baseLightness + 5),
        hslToHex((baseHue + 240) % 360, saturation * 0.9, baseLightness - 5),
        hslToHex(baseHue, saturation * 0.5, baseLightness + 20),
      ];

    case "tetradic":
      return [
        hslToHex(baseHue, saturation, baseLightness),
        hslToHex((baseHue + 90) % 360, saturation * 0.8, baseLightness + 5),
        hslToHex((baseHue + 180) % 360, saturation * 0.9, baseLightness),
        hslToHex((baseHue + 270) % 360, saturation * 0.7, baseLightness - 5),
      ];

    case "split-complementary":
      return [
        hslToHex(baseHue, saturation, baseLightness),
        hslToHex((baseHue + 150) % 360, saturation * 0.8, baseLightness + 8),
        hslToHex((baseHue + 210) % 360, saturation * 0.9, baseLightness - 8),
        hslToHex(baseHue, saturation * 0.5, baseLightness + 25),
      ];

    default:
      return [
        hslToHex(baseHue, saturation, baseLightness),
        hslToHex((baseHue + 30) % 360, saturation * 0.8, baseLightness + 10),
        hslToHex((baseHue + 60) % 360, saturation * 0.9, baseLightness - 10),
        hslToHex((baseHue + 90) % 360, saturation * 0.6, baseLightness + 20),
      ];
  }
}

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

  // Generate base color scheme
  const schemeColors = generateColorScheme(baseHue, scheme);

  // Create background and text colors
  const isLightTheme = Math.random() > 0.3; // 70% light themes
  const background = isLightTheme ? "#FFFFFF" : "#0F172A";
  const text = isLightTheme ? "#0F172A" : "#F8FAFC";

  let result: ColorSystem = {
    primary: schemeColors[0],
    secondary: schemeColors[1],
    accent: schemeColors[2],
    background,
    text,
    palette: {
      primary: schemeColors[0],
      secondary: schemeColors[1],
      accent: schemeColors[2],
      background,
      text,
      muted: isLightTheme ? "#F1F5F9" : "#334155",
      border: isLightTheme ? "#E2E8F0" : "#475569",
    },
  };

  // Apply pinned colors from current system
  if (options.pinnedPrimary && currentColors) {
    result.primary = currentColors.primary;
    if (result.palette) result.palette.primary = currentColors.primary;
  }

  if (options.pinnedSecondary && currentColors) {
    result.secondary = currentColors.secondary;
    if (result.palette) result.palette.secondary = currentColors.secondary;
  }

  if (options.pinnedAccent && currentColors) {
    result.accent = currentColors.accent;
    if (result.palette) result.palette.accent = currentColors.accent;
  }

  if (options.pinnedBackground && currentColors) {
    result.background = currentColors.background;
    if (result.palette) result.palette.background = currentColors.background;
  }

  if (options.pinnedText && currentColors) {
    result.text = currentColors.text;
    if (result.palette) result.palette.text = currentColors.text;
  }

  return result;
}

export function getRandomColorVariation(): ColorSystem {
  return generateColorVariation();
}

