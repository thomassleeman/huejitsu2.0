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
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for toHex", color);
    }
    return "#000000";
  }

  try {
    const result = chroma(color).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid hex result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] toHex failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return "#000000";
  }
}

/**
 * Convert any color format to RGB string
 */
export function toRgb(color: string): string {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for toRgb", color);
    }
    return "rgb(0, 0, 0)";
  }

  try {
    const result = chroma(color).css();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid RGB result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] toRgb failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return "rgb(0, 0, 0)";
  }
}

/**
 * Convert any color format to HSL string
 */
export function toHsl(color: string): string {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for toHsl", color);
    }
    return "hsl(0, 0%, 0%)";
  }

  try {
    const result = chroma(color).css("hsl");

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid HSL result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] toHsl failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return "hsl(0, 0%, 0%)";
  }
}

/**
 * Get all color formats for a given color
 */
export function getAllFormats(color: string): ColorFormats {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for getAllFormats", color);
    }
    return {
      hex: "#000000",
      rgb: "rgb(0, 0, 0)",
      hsl: "hsl(0, 0%, 0%)",
      hsv: "hsv(0, 0%, 0%)",
      lab: "lab(0, 0, 0)",
      lch: "lch(0, 0, 0)",
    };
  }

  try {
    const chromaColor = chroma(color);

    // Generate all formats with individual error handling
    let hex: string;
    let rgb: string;
    let hsl: string;
    let hsv: string;
    let lab: string;
    let lch: string;

    try {
      hex = chromaColor.hex();
    } catch {
      hex = "#000000";
    }

    try {
      rgb = chromaColor.css();
    } catch {
      rgb = "rgb(0, 0, 0)";
    }

    try {
      hsl = chromaColor.css("hsl");
    } catch {
      hsl = "hsl(0, 0%, 0%)";
    }

    try {
      const hsvValues = chromaColor.hsv();
      if (Array.isArray(hsvValues) && hsvValues.length >= 3) {
        hsv = `hsv(${hsvValues.map((v) => (isNaN(v) ? 0 : v)).join(", ")})`;
      } else {
        hsv = "hsv(0, 0%, 0%)";
      }
    } catch {
      hsv = "hsv(0, 0%, 0%)";
    }

    try {
      lab = chromaColor.css("lab");
    } catch {
      lab = "lab(0, 0, 0)";
    }

    try {
      lch = chromaColor.css("lch");
    } catch {
      lch = "lch(0, 0, 0)";
    }

    return {
      hex,
      rgb,
      hsl,
      hsv,
      lab,
      lch,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getAllFormats failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
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
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for lighten", color);
    }
    return "#808080";
  }

  if (typeof amount !== "number" || isNaN(amount) || !isFinite(amount)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid amount for lighten", amount);
    }
    amount = 0;
  }

  try {
    // Clamp amount to reasonable range
    amount = Math.max(-3, Math.min(3, amount));

    const result = chroma(color).brighten(amount).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid lighten result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] lighten failed:", error);
      console.warn("[ColorSystem] Input params:", { color, amount });
    }
    return color;
  }
}

/**
 * Darken a color by a given amount (0-1)
 */
export function darken(color: string, amount: number): string {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for darken", color);
    }
    return "#808080";
  }

  if (typeof amount !== "number" || isNaN(amount) || !isFinite(amount)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid amount for darken", amount);
    }
    amount = 0;
  }

  try {
    // Clamp amount to reasonable range
    amount = Math.max(-3, Math.min(3, amount));

    const result = chroma(color).darken(amount).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid darken result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] darken failed:", error);
      console.warn("[ColorSystem] Input params:", { color, amount });
    }
    return color;
  }
}

/**
 * Saturate a color by a given amount (0-1)
 */
export function saturate(color: string, amount: number): string {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for saturate", color);
    }
    return "#808080";
  }

  if (typeof amount !== "number" || isNaN(amount) || !isFinite(amount)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid amount for saturate", amount);
    }
    amount = 0;
  }

  try {
    // Clamp amount to reasonable range
    amount = Math.max(-3, Math.min(3, amount));

    const result = chroma(color).saturate(amount).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid saturate result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] saturate failed:", error);
      console.warn("[ColorSystem] Input params:", { color, amount });
    }
    return color;
  }
}

/**
 * Desaturate a color by a given amount (0-1)
 */
export function desaturate(color: string, amount: number): string {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for desaturate", color);
    }
    return "#808080";
  }

  if (typeof amount !== "number" || isNaN(amount) || !isFinite(amount)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid amount for desaturate", amount);
    }
    amount = 0;
  }

  try {
    // Clamp amount to reasonable range
    amount = Math.max(-3, Math.min(3, amount));

    const result = chroma(color).desaturate(amount).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid desaturate result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] desaturate failed:", error);
      console.warn("[ColorSystem] Input params:", { color, amount });
    }
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
  // Input validation
  if (
    !color1 ||
    typeof color1 !== "string" ||
    !color2 ||
    typeof color2 !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for mix", { color1, color2 });
    }
    return color1 || "#808080";
  }

  if (typeof ratio !== "number" || isNaN(ratio) || !isFinite(ratio)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid ratio for mix", ratio);
    }
    ratio = 0.5;
  }

  try {
    // Clamp ratio to valid range
    ratio = Math.max(0, Math.min(1, ratio));

    const result = chroma.mix(color1, color2, ratio).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid mix result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] mix failed:", error);
      console.warn("[ColorSystem] Input params:", { color1, color2, ratio });
    }
    return color1;
  }
}

/**
 * Get the luminance of a color (0-1)
 */
export function getLuminance(color: string): number {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for getLuminance", color);
    }
    return 0;
  }

  try {
    const luminance = chroma(color).luminance();

    // Validate result
    if (isNaN(luminance) || !isFinite(luminance)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid luminance result", {
          color,
          luminance,
        });
      }
      return 0;
    }

    return luminance;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getLuminance failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return 0;
  }
}

/**
 * Check if a color is considered light (luminance > 0.5)
 */
export function isLight(color: string): boolean {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for isLight", color);
    }
    return false;
  }

  try {
    const luminance = getLuminance(color);
    return luminance > 0.5;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] isLight failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return false;
  }
}

/**
 * Check if a color is considered dark (luminance <= 0.5)
 */
export function isDark(color: string): boolean {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for isDark", color);
    }
    return true; // Assume dark if invalid
  }

  try {
    return !isLight(color);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] isDark failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return true; // Assume dark if error
  }
}

/**
 * Generate a random color in hex format
 */
export function randomColor(): string {
  try {
    const result = chroma.random().hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid random color result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] randomColor failed:", error);
    }
    return "#808080";
  }
}

/**
 * Parse HSL values and return a chroma color
 */
export function fromHsl(h: number, s: number, l: number): string {
  // Input validation
  if (typeof h !== "number" || isNaN(h) || !isFinite(h)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid hue for fromHsl", h);
    }
    h = 0;
  }

  if (typeof s !== "number" || isNaN(s) || !isFinite(s)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid saturation for fromHsl", s);
    }
    s = 0;
  }

  if (typeof l !== "number" || isNaN(l) || !isFinite(l)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid lightness for fromHsl", l);
    }
    l = 50;
  }

  try {
    // Normalize values
    h = ((h % 360) + 360) % 360; // 0-360
    s = Math.max(0, Math.min(100, s)) / 100; // 0-1
    l = Math.max(0, Math.min(100, l)) / 100; // 0-1

    const result = chroma.hsl(h, s, l).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid HSL conversion result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] fromHsl failed:", error);
      console.warn("[ColorSystem] Input params:", { h, s, l });
    }
    return "#808080";
  }
}

/**
 * Parse RGB values and return a chroma color
 */
export function fromRgb(r: number, g: number, b: number): string {
  // Input validation
  if (typeof r !== "number" || isNaN(r) || !isFinite(r)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid red value for fromRgb", r);
    }
    r = 128;
  }

  if (typeof g !== "number" || isNaN(g) || !isFinite(g)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid green value for fromRgb", g);
    }
    g = 128;
  }

  if (typeof b !== "number" || isNaN(b) || !isFinite(b)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid blue value for fromRgb", b);
    }
    b = 128;
  }

  try {
    // Clamp values to valid RGB range
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));

    const result = chroma.rgb(r, g, b).hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid RGB conversion result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] fromRgb failed:", error);
      console.warn("[ColorSystem] Input params:", { r, g, b });
    }
    return "#808080";
  }
}

/**
 * Get HSL values from a color
 */
export function getHsl(color: string): [number, number, number] {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for getHsl", color);
    }
    return [0, 0, 0];
  }

  try {
    const hslValues = chroma(color).hsl();

    // Validate and sanitize result
    if (!Array.isArray(hslValues) || hslValues.length < 3) {
      throw new Error("Invalid HSL array result");
    }

    const [h, s, l] = hslValues;

    return [
      isNaN(h) || !isFinite(h) ? 0 : h,
      isNaN(s) || !isFinite(s) ? 0 : s,
      isNaN(l) || !isFinite(l) ? 0 : l,
    ];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getHsl failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return [0, 0, 0];
  }
}

/**
 * Get RGB values from a color
 */
export function getRgb(color: string): [number, number, number] {
  // Input validation
  if (!color || typeof color !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid color for getRgb", color);
    }
    return [0, 0, 0];
  }

  try {
    const rgbValues = chroma(color).rgb();

    // Validate and sanitize result
    if (!Array.isArray(rgbValues) || rgbValues.length < 3) {
      throw new Error("Invalid RGB array result");
    }

    const [r, g, b] = rgbValues;

    return [
      isNaN(r) || !isFinite(r) ? 0 : Math.max(0, Math.min(255, Math.round(r))),
      isNaN(g) || !isFinite(g) ? 0 : Math.max(0, Math.min(255, Math.round(g))),
      isNaN(b) || !isFinite(b) ? 0 : Math.max(0, Math.min(255, Math.round(b))),
    ];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getRgb failed:", error);
      console.warn("[ColorSystem] Input params:", { color });
    }
    return [0, 0, 0];
  }
}
