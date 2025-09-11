import chroma from "chroma-js";
import { toHex } from "./color-converter";
import { COLOR_CONFIG, getRandomInRange } from "./color-config";

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
  try {
    const hue = Math.floor(Math.random() * 360);

    // Validate result
    if (isNaN(hue) || !isFinite(hue)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid hue generated:", hue);
      }
      return 180; // Safe fallback
    }

    return hue;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getRandomHue failed:", error);
    }
    return 180; // Safe fallback
  }
}

/**
 * Generate monochromatic color scheme (variations of the same hue)
 */
export function generateMonochromatic(
  baseHue: number,
  saturation: number = COLOR_CONFIG.harmonyDefaults.saturation.default * 100,
  baseLightness: number = COLOR_CONFIG.harmonyDefaults.lightness.default * 100
): string[] {
  // Input validation
  if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseHue for generateMonochromatic",
        baseHue
      );
    }
    baseHue = 180;
  }

  if (
    typeof saturation !== "number" ||
    isNaN(saturation) ||
    !isFinite(saturation)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid saturation for generateMonochromatic",
        saturation
      );
    }
    saturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
  }

  if (
    typeof baseLightness !== "number" ||
    isNaN(baseLightness) ||
    !isFinite(baseLightness)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseLightness for generateMonochromatic",
        baseLightness
      );
    }
    baseLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
  }

  try {
    // Normalize hue to 0-360 range
    baseHue = ((baseHue % 360) + 360) % 360;

    // Clamp saturation and lightness to valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    baseLightness = Math.max(0, Math.min(100, baseLightness));

    const baseColor = chroma.hsl(
      baseHue,
      saturation / 100,
      baseLightness / 100
    );

    const colors = [
      baseColor.hex(),
      baseColor.brighten(0.5).hex(),
      baseColor.darken(0.5).hex(),
      baseColor.brighten(1).desaturate(0.5).hex(),
    ];

    // Validate all colors in the result
    const validColors = colors.filter((color) => {
      try {
        chroma(color); // Test if color is valid
        return true;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      throw new Error("No valid colors generated");
    }

    // Pad with safe defaults if needed
    while (validColors.length < 4) {
      validColors.push("#808080");
    }

    return validColors;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateMonochromatic failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseHue,
        saturation,
        baseLightness,
      });
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
}

/**
 * Generate analogous color scheme (adjacent colors on color wheel)
 */
export function generateAnalogous(
  baseHue: number,
  saturation: number = COLOR_CONFIG.harmonyDefaults.saturation.default * 100,
  baseLightness: number = COLOR_CONFIG.harmonyDefaults.lightness.default * 100
): string[] {
  // Input validation
  if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseHue for generateAnalogous",
        baseHue
      );
    }
    baseHue = 180;
  }

  if (
    typeof saturation !== "number" ||
    isNaN(saturation) ||
    !isFinite(saturation)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid saturation for generateAnalogous",
        saturation
      );
    }
    saturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
  }

  if (
    typeof baseLightness !== "number" ||
    isNaN(baseLightness) ||
    !isFinite(baseLightness)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseLightness for generateAnalogous",
        baseLightness
      );
    }
    baseLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
  }

  try {
    // Normalize hue to 0-360 range
    baseHue = ((baseHue % 360) + 360) % 360;

    // Clamp saturation and lightness to valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    baseLightness = Math.max(0, Math.min(100, baseLightness));

    const colors = [
      chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
      chroma
        .hsl(
          (baseHue + 30) % 360,
          Math.max(0, Math.min(1, (saturation * 0.8) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 10) / 100))
        )
        .hex(),
      chroma
        .hsl(
          (baseHue - 30 + 360) % 360,
          Math.max(0, Math.min(1, (saturation * 0.9) / 100)),
          Math.max(0, Math.min(1, (baseLightness - 10) / 100))
        )
        .hex(),
      chroma
        .hsl(
          (baseHue + 60) % 360,
          Math.max(0, Math.min(1, (saturation * 0.6) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 20) / 100))
        )
        .hex(),
    ];

    // Validate all colors in the result
    const validColors = colors.filter((color) => {
      try {
        chroma(color); // Test if color is valid
        return true;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      throw new Error("No valid colors generated");
    }

    // Pad with safe defaults if needed
    while (validColors.length < 4) {
      validColors.push("#808080");
    }

    return validColors;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateAnalogous failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseHue,
        saturation,
        baseLightness,
      });
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
}

/**
 * Generate complementary color scheme (opposite colors on color wheel)
 */
export function generateComplementary(
  baseHue: number,
  saturation: number = COLOR_CONFIG.harmonyDefaults.saturation.default * 100,
  baseLightness: number = COLOR_CONFIG.harmonyDefaults.lightness.default * 100
): string[] {
  // Input validation
  if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseHue for generateComplementary",
        baseHue
      );
    }
    baseHue = 180;
  }

  if (
    typeof saturation !== "number" ||
    isNaN(saturation) ||
    !isFinite(saturation)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid saturation for generateComplementary",
        saturation
      );
    }
    saturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
  }

  if (
    typeof baseLightness !== "number" ||
    isNaN(baseLightness) ||
    !isFinite(baseLightness)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseLightness for generateComplementary",
        baseLightness
      );
    }
    baseLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
  }

  try {
    // Normalize hue to 0-360 range
    baseHue = ((baseHue % 360) + 360) % 360;

    // Clamp saturation and lightness to valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    baseLightness = Math.max(0, Math.min(100, baseLightness));

    const complementaryHue = (baseHue + 180) % 360;

    const colors = [
      chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
      chroma
        .hsl(
          complementaryHue,
          Math.max(0, Math.min(1, (saturation * 0.8) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 10) / 100))
        )
        .hex(),
      chroma
        .hsl(
          baseHue,
          Math.max(0, Math.min(1, (saturation * 0.5) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 25) / 100))
        )
        .hex(),
      chroma
        .hsl(
          complementaryHue,
          Math.max(0, Math.min(1, (saturation * 0.4) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 30) / 100))
        )
        .hex(),
    ];

    // Validate all colors in the result
    const validColors = colors.filter((color) => {
      try {
        chroma(color); // Test if color is valid
        return true;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      throw new Error("No valid colors generated");
    }

    // Pad with safe defaults if needed
    while (validColors.length < 4) {
      validColors.push("#808080");
    }

    return validColors;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateComplementary failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseHue,
        saturation,
        baseLightness,
      });
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
}

/**
 * Generate triadic color scheme (three evenly spaced colors)
 */
export function generateTriadic(
  baseHue: number,
  saturation: number = COLOR_CONFIG.harmonyDefaults.saturation.default * 100,
  baseLightness: number = COLOR_CONFIG.harmonyDefaults.lightness.default * 100
): string[] {
  // Input validation
  if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseHue for generateTriadic",
        baseHue
      );
    }
    baseHue = 180;
  }

  if (
    typeof saturation !== "number" ||
    isNaN(saturation) ||
    !isFinite(saturation)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid saturation for generateTriadic",
        saturation
      );
    }
    saturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
  }

  if (
    typeof baseLightness !== "number" ||
    isNaN(baseLightness) ||
    !isFinite(baseLightness)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseLightness for generateTriadic",
        baseLightness
      );
    }
    baseLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
  }

  try {
    // Normalize hue to 0-360 range
    baseHue = ((baseHue % 360) + 360) % 360;

    // Clamp saturation and lightness to valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    baseLightness = Math.max(0, Math.min(100, baseLightness));

    const colors = [
      chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
      chroma
        .hsl(
          (baseHue + 120) % 360,
          Math.max(0, Math.min(1, (saturation * 0.8) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 5) / 100))
        )
        .hex(),
      chroma
        .hsl(
          (baseHue + 240) % 360,
          Math.max(0, Math.min(1, (saturation * 0.9) / 100)),
          Math.max(0, Math.min(1, (baseLightness - 5) / 100))
        )
        .hex(),
      chroma
        .hsl(
          baseHue,
          Math.max(0, Math.min(1, (saturation * 0.5) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 20) / 100))
        )
        .hex(),
    ];

    // Validate all colors in the result
    const validColors = colors.filter((color) => {
      try {
        chroma(color); // Test if color is valid
        return true;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      throw new Error("No valid colors generated");
    }

    // Pad with safe defaults if needed
    while (validColors.length < 4) {
      validColors.push("#808080");
    }

    return validColors;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateTriadic failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseHue,
        saturation,
        baseLightness,
      });
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
}

/**
 * Generate tetradic color scheme (four evenly spaced colors)
 */
export function generateTetradic(
  baseHue: number,
  saturation: number = COLOR_CONFIG.harmonyDefaults.saturation.default * 100,
  baseLightness: number = COLOR_CONFIG.harmonyDefaults.lightness.default * 100
): string[] {
  // Input validation
  if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseHue for generateTetradic",
        baseHue
      );
    }
    baseHue = 180;
  }

  if (
    typeof saturation !== "number" ||
    isNaN(saturation) ||
    !isFinite(saturation)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid saturation for generateTetradic",
        saturation
      );
    }
    saturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
  }

  if (
    typeof baseLightness !== "number" ||
    isNaN(baseLightness) ||
    !isFinite(baseLightness)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseLightness for generateTetradic",
        baseLightness
      );
    }
    baseLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
  }

  try {
    // Normalize hue to 0-360 range
    baseHue = ((baseHue % 360) + 360) % 360;

    // Clamp saturation and lightness to valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    baseLightness = Math.max(0, Math.min(100, baseLightness));

    const colors = [
      chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
      chroma
        .hsl(
          (baseHue + 90) % 360,
          Math.max(0, Math.min(1, (saturation * 0.8) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 5) / 100))
        )
        .hex(),
      chroma
        .hsl(
          (baseHue + 180) % 360,
          Math.max(0, Math.min(1, (saturation * 0.9) / 100)),
          Math.max(0, Math.min(1, baseLightness / 100))
        )
        .hex(),
      chroma
        .hsl(
          (baseHue + 270) % 360,
          Math.max(0, Math.min(1, (saturation * 0.7) / 100)),
          Math.max(0, Math.min(1, (baseLightness - 5) / 100))
        )
        .hex(),
    ];

    // Validate all colors in the result
    const validColors = colors.filter((color) => {
      try {
        chroma(color); // Test if color is valid
        return true;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      throw new Error("No valid colors generated");
    }

    // Pad with safe defaults if needed
    while (validColors.length < 4) {
      validColors.push("#808080");
    }

    return validColors;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateTetradic failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseHue,
        saturation,
        baseLightness,
      });
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
}

/**
 * Generate split-complementary color scheme (base + two colors adjacent to complement)
 */
export function generateSplitComplementary(
  baseHue: number,
  saturation: number = COLOR_CONFIG.harmonyDefaults.saturation.default * 100,
  baseLightness: number = COLOR_CONFIG.harmonyDefaults.lightness.default * 100
): string[] {
  // Input validation
  if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseHue for generateSplitComplementary",
        baseHue
      );
    }
    baseHue = 180;
  }

  if (
    typeof saturation !== "number" ||
    isNaN(saturation) ||
    !isFinite(saturation)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid saturation for generateSplitComplementary",
        saturation
      );
    }
    saturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
  }

  if (
    typeof baseLightness !== "number" ||
    isNaN(baseLightness) ||
    !isFinite(baseLightness)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseLightness for generateSplitComplementary",
        baseLightness
      );
    }
    baseLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
  }

  try {
    // Normalize hue to 0-360 range
    baseHue = ((baseHue % 360) + 360) % 360;

    // Clamp saturation and lightness to valid ranges
    saturation = Math.max(0, Math.min(100, saturation));
    baseLightness = Math.max(0, Math.min(100, baseLightness));

    const colors = [
      chroma.hsl(baseHue, saturation / 100, baseLightness / 100).hex(),
      chroma
        .hsl(
          (baseHue + 150) % 360,
          Math.max(0, Math.min(1, (saturation * 0.8) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 8) / 100))
        )
        .hex(),
      chroma
        .hsl(
          (baseHue + 210) % 360,
          Math.max(0, Math.min(1, (saturation * 0.9) / 100)),
          Math.max(0, Math.min(1, (baseLightness - 8) / 100))
        )
        .hex(),
      chroma
        .hsl(
          baseHue,
          Math.max(0, Math.min(1, (saturation * 0.5) / 100)),
          Math.max(0, Math.min(1, (baseLightness + 25) / 100))
        )
        .hex(),
    ];

    // Validate all colors in the result
    const validColors = colors.filter((color) => {
      try {
        chroma(color); // Test if color is valid
        return true;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      throw new Error("No valid colors generated");
    }

    // Pad with safe defaults if needed
    while (validColors.length < 4) {
      validColors.push("#808080");
    }

    return validColors;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateSplitComplementary failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseHue,
        saturation,
        baseLightness,
      });
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
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
  // Input validation
  if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid baseHue for generateColorScheme",
        baseHue
      );
    }
    baseHue = 180;
  }

  if (!scheme || typeof scheme !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid scheme for generateColorScheme",
        scheme
      );
    }
    scheme = "analogous";
  }

  try {
    // Generate dynamic saturation and lightness with better ranges using configuration
    let dynamicSaturation: number;
    let dynamicLightness: number;

    try {
      dynamicSaturation =
        saturation ??
        getRandomInRange(
          COLOR_CONFIG.harmonyDefaults.saturation.min * 100,
          COLOR_CONFIG.harmonyDefaults.saturation.max * 100
        );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate dynamic saturation",
          error
        );
      }
      dynamicSaturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
    }

    try {
      dynamicLightness =
        baseLightness ??
        getRandomInRange(
          COLOR_CONFIG.harmonyDefaults.lightness.min * 100,
          COLOR_CONFIG.harmonyDefaults.lightness.max * 100
        );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate dynamic lightness",
          error
        );
      }
      dynamicLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
    }

    // Validate generated values
    if (
      typeof dynamicSaturation !== "number" ||
      isNaN(dynamicSaturation) ||
      !isFinite(dynamicSaturation)
    ) {
      dynamicSaturation = COLOR_CONFIG.harmonyDefaults.saturation.default * 100;
    }

    if (
      typeof dynamicLightness !== "number" ||
      isNaN(dynamicLightness) ||
      !isFinite(dynamicLightness)
    ) {
      dynamicLightness = COLOR_CONFIG.harmonyDefaults.lightness.default * 100;
    }

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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateColorScheme failed:", error);
      console.warn("[ColorSystem] Input params:", {
        baseHue,
        scheme,
        saturation,
        baseLightness,
      });
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
}

/**
 * Generate a random color scheme
 */
export function generateRandomColorScheme(): string[] {
  try {
    const randomScheme =
      COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];
    const randomHue = getRandomHue();

    // Validate scheme selection
    if (!randomScheme) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Failed to select random scheme");
      }
      return generateColorScheme(randomHue, "analogous");
    }

    return generateColorScheme(randomHue, randomScheme);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateRandomColorScheme failed:", error);
    }
    return ["#808080", "#999999", "#666666", "#B0B0B0"];
  }
}

/**
 * Generate tints (lighter variations) of a color
 */
export function generateTints(color: string, count: number = 5): string[] {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for generateTints", color);
    }
    return ["#808080"];
  }

  if (
    typeof count !== "number" ||
    isNaN(count) ||
    !isFinite(count) ||
    count <= 0
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid count for generateTints", count);
    }
    count = 5;
  }

  try {
    const baseColor = chroma(color);
    const tints: string[] = [];

    // Clamp count to reasonable range
    count = Math.max(1, Math.min(20, Math.floor(count)));

    for (let i = 0; i < count; i++) {
      try {
        const factor = (i + 1) / (count + 1);
        const tint = chroma.mix(baseColor, "white", factor).hex();

        // Validate the generated tint
        if (tint && typeof tint === "string") {
          tints.push(tint);
        } else {
          tints.push("#808080");
        }
      } catch (mixError) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[ColorSystem] Failed to generate tint", i, mixError);
        }
        tints.push("#808080");
      }
    }

    return tints.length > 0 ? tints : ["#808080"];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateTints failed:", error);
      console.warn("[ColorSystem] Input params:", { color, count });
    }
    return ["#808080"];
  }
}

/**
 * Generate shades (darker variations) of a color
 */
export function generateShades(color: string, count: number = 5): string[] {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for generateShades", color);
    }
    return ["#808080"];
  }

  if (
    typeof count !== "number" ||
    isNaN(count) ||
    !isFinite(count) ||
    count <= 0
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid count for generateShades", count);
    }
    count = 5;
  }

  try {
    const baseColor = chroma(color);
    const shades: string[] = [];

    // Clamp count to reasonable range
    count = Math.max(1, Math.min(20, Math.floor(count)));

    for (let i = 0; i < count; i++) {
      try {
        const factor = (i + 1) / (count + 1);
        const shade = chroma.mix(baseColor, "black", factor).hex();

        // Validate the generated shade
        if (shade && typeof shade === "string") {
          shades.push(shade);
        } else {
          shades.push("#808080");
        }
      } catch (mixError) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[ColorSystem] Failed to generate shade", i, mixError);
        }
        shades.push("#808080");
      }
    }

    return shades.length > 0 ? shades : ["#808080"];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateShades failed:", error);
      console.warn("[ColorSystem] Input params:", { color, count });
    }
    return ["#808080"];
  }
}

/**
 * Generate tones (grayed variations) of a color
 */
export function generateTones(color: string, count: number = 5): string[] {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for generateTones", color);
    }
    return ["#808080"];
  }

  if (
    typeof count !== "number" ||
    isNaN(count) ||
    !isFinite(count) ||
    count <= 0
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid count for generateTones", count);
    }
    count = 5;
  }

  try {
    const baseColor = chroma(color);
    const tones: string[] = [];

    // Clamp count to reasonable range
    count = Math.max(1, Math.min(20, Math.floor(count)));

    for (let i = 0; i < count; i++) {
      try {
        const factor = (i + 1) / (count + 1);
        const tone = baseColor.desaturate(factor).hex();

        // Validate the generated tone
        if (tone && typeof tone === "string") {
          tones.push(tone);
        } else {
          tones.push("#808080");
        }
      } catch (desaturateError) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[ColorSystem] Failed to generate tone",
            i,
            desaturateError
          );
        }
        tones.push("#808080");
      }
    }

    return tones.length > 0 ? tones : ["#808080"];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateTones failed:", error);
      console.warn("[ColorSystem] Input params:", { color, count });
    }
    return ["#808080"];
  }
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
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid color for generateCompletePalette",
        color
      );
    }
    return {
      base: "#808080",
      tints: ["#808080"],
      shades: ["#808080"],
      tones: ["#808080"],
    };
  }

  try {
    const base = toHex(color);
    const tints = generateTints(color);
    const shades = generateShades(color);
    const tones = generateTones(color);

    // Validate all results
    const validBase = base && typeof base === "string" ? base : "#808080";
    const validTints =
      Array.isArray(tints) && tints.length > 0 ? tints : ["#808080"];
    const validShades =
      Array.isArray(shades) && shades.length > 0 ? shades : ["#808080"];
    const validTones =
      Array.isArray(tones) && tones.length > 0 ? tones : ["#808080"];

    return {
      base: validBase,
      tints: validTints,
      shades: validShades,
      tones: validTones,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateCompletePalette failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return {
      base: "#808080",
      tints: ["#808080"],
      shades: ["#808080"],
      tones: ["#808080"],
    };
  }
}
