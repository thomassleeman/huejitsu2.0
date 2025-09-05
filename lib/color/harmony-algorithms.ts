import chroma from "chroma-js";
import { toHex } from "./color-converter";

/**
 * Color harmony generation algorithms using chroma-js
 * Implements color theory relationships with mathematical precision
 */

export const COLOR_SCHEMES = [
  "monochromatic",
  "analogous",
  "complementary",
  "triadic",
  "tetradic",
  "split-complementary",
] as const;

export type ColorSchemeType = (typeof COLOR_SCHEMES)[number];

/**
 * Generate a random hue value (0-360)
 */
export function getRandomHue(): number {
  return Math.floor(Math.random() * 360);
}

/**
 * Generate monochromatic color scheme (variations of the same hue)
 */
export function generateMonochromatic(
  baseHue: number,
  saturation: number = 70,
  baseLightness: number = 50
): string[] {
  const baseColor = chroma.hsl(baseHue, saturation / 100, baseLightness / 100);

  return [
    baseColor.hex(),
    baseColor.brighten(0.5).hex(),
    baseColor.darken(0.5).hex(),
    baseColor.brighten(1).desaturate(0.5).hex(),
  ];
}

/**
 * Generate analogous color scheme (adjacent colors on color wheel)
 */
export function generateAnalogous(
  baseHue: number,
  saturation: number = 70,
  baseLightness: number = 50
): string[] {
  return [
    chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
    chroma
      .hsl(
        (baseHue + 30) % 360,
        (saturation * 0.8) / 100,
        (baseLightness + 10) / 100
      )
      .hex(),
    chroma
      .hsl(
        (baseHue - 30 + 360) % 360,
        (saturation * 0.9) / 100,
        (baseLightness - 10) / 100
      )
      .hex(),
    chroma
      .hsl(
        (baseHue + 60) % 360,
        (saturation * 0.6) / 100,
        (baseLightness + 20) / 100
      )
      .hex(),
  ];
}

/**
 * Generate complementary color scheme (opposite colors on color wheel)
 */
export function generateComplementary(
  baseHue: number,
  saturation: number = 70,
  baseLightness: number = 50
): string[] {
  const complementaryHue = (baseHue + 180) % 360;

  return [
    chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
    chroma
      .hsl(
        complementaryHue,
        (saturation * 0.8) / 100,
        (baseLightness + 10) / 100
      )
      .hex(),
    chroma
      .hsl(baseHue, (saturation * 0.5) / 100, (baseLightness + 25) / 100)
      .hex(),
    chroma
      .hsl(
        complementaryHue,
        (saturation * 0.4) / 100,
        (baseLightness + 30) / 100
      )
      .hex(),
  ];
}

/**
 * Generate triadic color scheme (three evenly spaced colors)
 */
export function generateTriadic(
  baseHue: number,
  saturation: number = 70,
  baseLightness: number = 50
): string[] {
  return [
    chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
    chroma
      .hsl(
        (baseHue + 120) % 360,
        (saturation * 0.8) / 100,
        (baseLightness + 5) / 100
      )
      .hex(),
    chroma
      .hsl(
        (baseHue + 240) % 360,
        (saturation * 0.9) / 100,
        (baseLightness - 5) / 100
      )
      .hex(),
    chroma
      .hsl(baseHue, (saturation * 0.5) / 100, (baseLightness + 20) / 100)
      .hex(),
  ];
}

/**
 * Generate tetradic color scheme (four evenly spaced colors)
 */
export function generateTetradic(
  baseHue: number,
  saturation: number = 70,
  baseLightness: number = 50
): string[] {
  return [
    chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
    chroma
      .hsl(
        (baseHue + 90) % 360,
        (saturation * 0.8) / 100,
        (baseLightness + 5) / 100
      )
      .hex(),
    chroma
      .hsl((baseHue + 180) % 360, (saturation * 0.9) / 100, baseLightness / 100)
      .hex(),
    chroma
      .hsl(
        (baseHue + 270) % 360,
        (saturation * 0.7) / 100,
        (baseLightness - 5) / 100
      )
      .hex(),
  ];
}

/**
 * Generate split-complementary color scheme (base + two colors adjacent to complement)
 */
export function generateSplitComplementary(
  baseHue: number,
  saturation: number = 70,
  baseLightness: number = 50
): string[] {
  return [
    chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
    chroma
      .hsl(
        (baseHue + 150) % 360,
        (saturation * 0.8) / 100,
        (baseLightness + 8) / 100
      )
      .hex(),
    chroma
      .hsl(
        (baseHue + 210) % 360,
        (saturation * 0.9) / 100,
        (baseLightness - 8) / 100
      )
      .hex(),
    chroma
      .hsl(baseHue, (saturation * 0.5) / 100, (baseLightness + 25) / 100)
      .hex(),
  ];
}

/**
 * Generate color scheme based on type and base hue
 */
export function generateColorScheme(
  baseHue: number,
  scheme: ColorSchemeType,
  saturation?: number,
  baseLightness?: number
): string[] {
  // Generate dynamic saturation and lightness with better ranges
  const dynamicSaturation = saturation ?? 65 + Math.random() * 25; // 65-90%
  const dynamicLightness = baseLightness ?? 45 + Math.random() * 20; // 45-65%

  switch (scheme) {
    case "monochromatic":
      return generateMonochromatic(
        baseHue,
        dynamicSaturation,
        dynamicLightness
      );
    case "analogous":
      return generateAnalogous(baseHue, dynamicSaturation, dynamicLightness);
    case "complementary":
      return generateComplementary(
        baseHue,
        dynamicSaturation,
        dynamicLightness
      );
    case "triadic":
      return generateTriadic(baseHue, dynamicSaturation, dynamicLightness);
    case "tetradic":
      return generateTetradic(baseHue, dynamicSaturation, dynamicLightness);
    case "split-complementary":
      return generateSplitComplementary(
        baseHue,
        dynamicSaturation,
        dynamicLightness
      );
    default:
      return generateAnalogous(baseHue, dynamicSaturation, dynamicLightness);
  }
}

/**
 * Generate a random color scheme
 */
export function generateRandomColorScheme(): string[] {
  const randomScheme =
    COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];
  const randomHue = getRandomHue();
  return generateColorScheme(randomHue, randomScheme);
}

/**
 * Generate tints (lighter variations) of a color
 */
export function generateTints(color: string, count: number = 5): string[] {
  const baseColor = chroma(color);
  const tints: string[] = [];

  for (let i = 0; i < count; i++) {
    const factor = (i + 1) / (count + 1);
    tints.push(chroma.mix(baseColor, "white", factor).hex());
  }

  return tints;
}

/**
 * Generate shades (darker variations) of a color
 */
export function generateShades(color: string, count: number = 5): string[] {
  const baseColor = chroma(color);
  const shades: string[] = [];

  for (let i = 0; i < count; i++) {
    const factor = (i + 1) / (count + 1);
    shades.push(chroma.mix(baseColor, "black", factor).hex());
  }

  return shades;
}

/**
 * Generate tones (grayed variations) of a color
 */
export function generateTones(color: string, count: number = 5): string[] {
  const baseColor = chroma(color);
  const tones: string[] = [];

  for (let i = 0; i < count; i++) {
    const factor = (i + 1) / (count + 1);
    tones.push(baseColor.desaturate(factor).hex());
  }

  return tones;
}

/**
 * Generate a complete color palette with tints, shades, and tones
 */
export function generateCompletePalette(color: string): {
  base: string;
  tints: string[];
  shades: string[];
  tones: string[];
} {
  return {
    base: toHex(color),
    tints: generateTints(color),
    shades: generateShades(color),
    tones: generateTones(color),
  };
}
