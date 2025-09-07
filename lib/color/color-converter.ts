import chroma from "chroma-js";

/**
 * Color format conversion utilities using chroma-js
 * Provides consistent color manipulation and conversion functions
 */

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  lab: string;
  lch: string;
}

/**
 * Convert any color format to hex
 */
export function toHex(color: string): string {
  try {
    return chroma(color).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return "#000000";
  }
}

/**
 * Convert any color format to RGB string
 */
export function toRgb(color: string): string {
  try {
    return chroma(color).css();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return "rgb(0, 0, 0)";
  }
}

/**
 * Convert any color format to HSL string
 */
export function toHsl(color: string): string {
  try {
    return chroma(color).css("hsl");
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return "hsl(0, 0%, 0%)";
  }
}

/**
 * Get all color formats for a given color
 */
export function getAllFormats(color: string): ColorFormats {
  try {
    const chromaColor = chroma(color);
    return {
      hex: chromaColor.hex(),
      rgb: chromaColor.css(),
      hsl: chromaColor.css("hsl"),
      hsv: `hsv(${chromaColor.hsv().join(", ")})`,
      lab: chromaColor.css("lab"),
      lch: chromaColor.css("lch"),
    };
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return {
      hex: "#000000",
      rgb: "rgb(0, 0, 0)",
      hsl: "hsl(0, 0%, 0%)",
      hsv: "hsv(0, 0%, 0%)",
      lab: "lab(0, 0, 0)",
      lch: "lch(0, 0, 0)",
    };
  }
}

/**
 * Lighten a color by a given amount (0-1)
 */
export function lighten(color: string, amount: number): string {
  try {
    return chroma(color).brighten(amount).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return color;
  }
}

/**
 * Darken a color by a given amount (0-1)
 */
export function darken(color: string, amount: number): string {
  try {
    return chroma(color).darken(amount).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return color;
  }
}

/**
 * Saturate a color by a given amount (0-1)
 */
export function saturate(color: string, amount: number): string {
  try {
    return chroma(color).saturate(amount).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return color;
  }
}

/**
 * Desaturate a color by a given amount (0-1)
 */
export function desaturate(color: string, amount: number): string {
  try {
    return chroma(color).desaturate(amount).hex();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return color;
  }
}

/**
 * Mix two colors with an optional ratio (0-1, default 0.5)
 */
export function mix(
  color1: string,
  color2: string,
  ratio: number = 0.5
): string {
  try {
    return chroma.mix(color1, color2, ratio).hex();
  } catch (error) {
    console.warn(`Invalid color formats: ${color1}, ${color2}`);
    return color1;
  }
}

/**
 * Get the luminance of a color (0-1)
 */
export function getLuminance(color: string): number {
  try {
    return chroma(color).luminance();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return 0;
  }
}

/**
 * Check if a color is considered light (luminance > 0.5)
 */
export function isLight(color: string): boolean {
  return getLuminance(color) > 0.5;
}

/**
 * Check if a color is considered dark (luminance <= 0.5)
 */
export function isDark(color: string): boolean {
  return !isLight(color);
}

/**
 * Generate a random color in hex format
 */
export function randomColor(): string {
  return chroma.random().hex();
}

/**
 * Parse HSL values and return a chroma color
 */
export function fromHsl(h: number, s: number, l: number): string {
  return chroma.hsl(h, s / 100, l / 100).hex();
}

/**
 * Parse RGB values and return a chroma color
 */
export function fromRgb(r: number, g: number, b: number): string {
  return chroma.rgb(r, g, b).hex();
}

/**
 * Get HSL values from a color
 */
export function getHsl(color: string): [number, number, number] {
  try {
    return chroma(color).hsl();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return [0, 0, 0];
  }
}

/**
 * Get RGB values from a color
 */
export function getRgb(color: string): [number, number, number] {
  try {
    return chroma(color).rgb();
  } catch (error) {
    console.warn(`Invalid color format: ${color}`);
    return [0, 0, 0];
  }
}
