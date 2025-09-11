import type { ColorSystem } from "@/types/design-system";
import {
  generateColorScheme,
  getRandomHue,
  COLOR_SCHEMES,
  type ColorSchemeType,
  generateTriadic,
  generateComplementary,
  generateTetradic,
  generateAnalogous,
  generateMonochromatic,
  generateSplitComplementary,
} from "./harmony-algorithms";
import {
  adjustForContrast,
  generateBackgroundFromBase,
} from "./contrast-calculator";
import { COLOR_CONFIG } from "./color-config";
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

// Type alias for compatibility with new interface
export type ColorGenerationOptions = ColorVariationOptions;

// Type alias for ColorHarmony to match the task specification
export type ColorHarmony = ColorSchemeType;

/**
 * Extract pinned color data from the current ColorSystem
 * @param colors - Current color system (may be null)
 * @param options - Color generation options
 * @returns Object containing pinned colors map, base hue, and pinned positions
 */
function extractPinnedColorData(
  colors: ColorSystem | null,
  options: ColorGenerationOptions
): {
  pinnedColors: Map<string, string>;
  baseHue: number | null;
  pinnedPositions: string[];
} {
  try {
    const pinnedColors = new Map<string, string>();
    const pinnedPositions: string[] = [];
    let baseHue: number | null = null;

    // Input validation
    if (!colors || !options || typeof options !== "object") {
      return { pinnedColors, baseHue, pinnedPositions };
    }

    // Extract pinned colors and determine base hue
    // Priority order: primary, secondary, accent (background and text are less suitable for harmony base)
    if (options.pinnedPrimary && colors.primary) {
      pinnedColors.set("primary", colors.primary);
      pinnedPositions.push("primary");
      if (baseHue === null) {
        try {
          const hue = chroma(colors.primary).get("hsl.h");
          baseHue =
            hue !== null && hue !== undefined && !isNaN(hue) ? hue : null;
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[ColorSystem] Failed to extract hue from primary color:",
              error
            );
          }
        }
      }
    }

    if (options.pinnedSecondary && colors.secondary) {
      pinnedColors.set("secondary", colors.secondary);
      pinnedPositions.push("secondary");
      if (baseHue === null) {
        try {
          const hue = chroma(colors.secondary).get("hsl.h");
          baseHue =
            hue !== null && hue !== undefined && !isNaN(hue) ? hue : null;
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[ColorSystem] Failed to extract hue from secondary color:",
              error
            );
          }
        }
      }
    }

    if (options.pinnedAccent && colors.accent) {
      pinnedColors.set("accent", colors.accent);
      pinnedPositions.push("accent");
      if (baseHue === null) {
        try {
          const hue = chroma(colors.accent).get("hsl.h");
          baseHue =
            hue !== null && hue !== undefined && !isNaN(hue) ? hue : null;
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[ColorSystem] Failed to extract hue from accent color:",
              error
            );
          }
        }
      }
    }

    // Also track background and text if pinned (they won't be used for base hue)
    if (options.pinnedBackground && colors.background) {
      pinnedColors.set("background", colors.background);
      pinnedPositions.push("background");
    }

    if (options.pinnedText && colors.text) {
      pinnedColors.set("text", colors.text);
      pinnedPositions.push("text");
    }

    return { pinnedColors, baseHue, pinnedPositions };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] extractPinnedColorData failed:", error);
    }
    return { pinnedColors: new Map(), baseHue: null, pinnedPositions: [] };
  }
}

/**
 * Generate harmony colors based on color scheme and base hue
 * @param baseHue - Base hue to generate harmony from
 * @param colorScheme - Type of color harmony to generate
 * @param pinnedPositions - Array of pinned positions to exclude from generation
 * @returns Array of hex colors for unpinned positions
 */
function generateHarmonyColors(
  baseHue: number,
  colorScheme: ColorHarmony,
  pinnedPositions: string[]
): string[] {
  try {
    // Input validation
    if (typeof baseHue !== "number" || isNaN(baseHue) || !isFinite(baseHue)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid baseHue for generateHarmonyColors:",
          baseHue
        );
      }
      baseHue = Math.random() * 360;
    }

    // Normalize hue to 0-360 range
    baseHue = ((baseHue % 360) + 360) % 360;

    // Generate colors using the appropriate harmony function
    let harmonyColors: string[];

    switch (colorScheme) {
      case "monochromatic":
        harmonyColors = generateMonochromatic(baseHue);
        break;
      case "analogous":
        harmonyColors = generateAnalogous(baseHue);
        break;
      case "complementary":
        harmonyColors = generateComplementary(baseHue);
        break;
      case "triadic":
        harmonyColors = generateTriadic(baseHue);
        break;
      case "tetradic":
        harmonyColors = generateTetradic(baseHue);
        break;
      case "split-complementary":
        harmonyColors = generateSplitComplementary(baseHue);
        break;
      default:
        harmonyColors = generateAnalogous(baseHue);
    }

    // Validate generated colors
    const validColors = harmonyColors.filter((color) => {
      try {
        chroma(color); // Test if color is valid
        return true;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] No valid harmony colors generated, using fallbacks"
        );
      }
      return ["#3B82F6", "#6366F1", "#8B5CF6"];
    }

    // Ensure we have at least 3 colors, pad with safe defaults if needed
    while (validColors.length < 3) {
      validColors.push("#808080");
    }

    return validColors;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateHarmonyColors failed:", error);
    }
    return ["#3B82F6", "#6366F1", "#8B5CF6"];
  }
}

/**
 * Apply pinned colors and merge with generated harmony colors
 * @param generatedColors - Array of generated harmony colors
 * @param pinnedColors - Map of pinned colors by position
 * @param colorPositions - Array of semantic color positions
 * @returns ColorSystem with merged colors
 */
function applyPinnedColors(
  generatedColors: string[],
  pinnedColors: Map<string, string>,
  colorPositions: string[]
): ColorSystem {
  try {
    // Input validation
    if (!Array.isArray(generatedColors) || generatedColors.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid generatedColors for applyPinnedColors"
        );
      }
      generatedColors = ["#3B82F6", "#6366F1", "#8B5CF6"];
    }

    if (!Array.isArray(colorPositions)) {
      colorPositions = ["primary", "secondary", "accent"];
    }

    // Ensure we have enough colors for all positions
    const safeColors = [...generatedColors];
    while (safeColors.length < colorPositions.length) {
      safeColors.push("#808080");
    }

    // Build the color system by applying pinned colors or using generated ones
    const result: Partial<ColorSystem> = {};
    let generatedIndex = 0;

    for (const position of colorPositions) {
      if (pinnedColors.has(position)) {
        // Use pinned color
        (result as Record<string, string>)[position] =
          pinnedColors.get(position)!;
      } else {
        // Use generated color
        (result as Record<string, string>)[position] =
          safeColors[generatedIndex];
        generatedIndex++;
      }
    }

    // Ensure all required properties are set with fallbacks
    const finalResult: ColorSystem = {
      primary: result.primary || safeColors[0] || "#3B82F6",
      secondary: result.secondary || safeColors[1] || "#6366F1",
      accent: result.accent || safeColors[2] || "#8B5CF6",
      background: result.background || "#FFFFFF",
      text: result.text || "#111827",
      palette: {
        primary: result.primary || safeColors[0] || "#3B82F6",
        secondary: result.secondary || safeColors[1] || "#6366F1",
        accent: result.accent || safeColors[2] || "#8B5CF6",
        background: result.background || "#FFFFFF",
        text: result.text || "#111827",
        muted: "#F3F4F6",
        border: "#E5E7EB",
      },
    };

    return finalResult;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] applyPinnedColors failed:", error);
    }
    // Return safe fallback
    return {
      primary: "#3B82F6",
      secondary: "#6366F1",
      accent: "#8B5CF6",
      background: "#FFFFFF",
      text: "#111827",
      palette: {
        primary: "#3B82F6",
        secondary: "#6366F1",
        accent: "#8B5CF6",
        background: "#FFFFFF",
        text: "#111827",
        muted: "#F3F4F6",
        border: "#E5E7EB",
      },
    };
  }
}

/**
 * Generate background and text colors based on theme preference
 * @param colors - Color system with primary colors
 * @param backgroundThemePreference - Theme preference for background
 * @returns Object with background and text colors
 */
function generateBackgroundAndText(
  colors: ColorSystem,
  backgroundThemePreference: "light" | "dark" | "random"
): {
  background: string;
  text: string;
} {
  try {
    // Input validation
    if (!colors || typeof colors !== "object" || !colors.primary) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid colors for generateBackgroundAndText"
        );
      }
      return {
        background: "#FFFFFF",
        text: "#111827",
      };
    }

    const baseColor = colors.primary;
    let background: string;

    // Generate background using chroma-js based on theme preference
    try {
      if (backgroundThemePreference === "random") {
        // For random theme, choose randomly
        const randomTheme = Math.random() > 0.5 ? "light" : "dark";
        background = generateBackgroundFromBase(
          baseColor,
          randomTheme,
          COLOR_CONFIG
        );
      } else {
        background = generateBackgroundFromBase(
          baseColor,
          backgroundThemePreference,
          COLOR_CONFIG
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to generate background, using fallback:",
          error
        );
      }
      background = backgroundThemePreference === "dark" ? "#1a1b1e" : "#ffffff";
    }

    // Generate optimal text color using chroma-js contrast calculations
    let text: string;
    try {
      const bg = chroma(background);

      // Create candidate text colors
      const darkText = chroma("#1a1a1a");
      const lightText = chroma("#fafafa");

      // Calculate contrast ratios
      const darkContrast = chroma.contrast(bg, darkText);
      const lightContrast = chroma.contrast(bg, lightText);

      // Select based on which provides better contrast
      if (darkContrast >= lightContrast && darkContrast >= 4.5) {
        text = darkText.hex();
      } else if (lightContrast >= 4.5) {
        text = lightText.hex();
      } else {
        // If neither meets WCAG AA, adjust the better option
        const baseText = darkContrast > lightContrast ? darkText : lightText;
        text = adjustForContrast(
          baseText.hex(),
          background,
          COLOR_CONFIG.contrastRequirements.AA.normal
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Failed to calculate optimal text color, using fallback:",
          error
        );
      }
      // Fallback based on simple luminance check
      try {
        const bgLuminance = chroma(background).luminance();
        text = bgLuminance > 0.5 ? "#111827" : "#F9FAFB";
      } catch {
        text = "#111827"; // Ultimate fallback
      }
    }

    return { background, text };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateBackgroundAndText failed:", error);
    }
    return {
      background: "#FFFFFF",
      text: "#111827",
    };
  }
}

/**
 * Generate palette variations for muted and border colors
 * @param colors - Base color system
 * @returns Object with muted and border color variations
 */
function generatePaletteVariations(colors: ColorSystem): {
  muted: Record<string, string>;
  borders: Record<string, string>;
} {
  try {
    // Input validation
    if (!colors || typeof colors !== "object") {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid colors for generatePaletteVariations"
        );
      }
      return {
        muted: { primary: "#F3F4F6", secondary: "#F3F4F6", accent: "#F3F4F6" },
        borders: {
          primary: "#E5E7EB",
          secondary: "#E5E7EB",
          accent: "#E5E7EB",
        },
      };
    }

    const muted: Record<string, string> = {};
    const borders: Record<string, string> = {};

    // Generate muted versions using chroma-js desaturate
    const colorPositions = ["primary", "secondary", "accent"];
    for (const position of colorPositions) {
      const color = (colors as unknown as Record<string, string>)[position];
      if (color && typeof color === "string") {
        try {
          // Create muted version by desaturating
          muted[position] = chroma(color).desaturate(1.5).hex();
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[ColorSystem] Failed to create muted ${position}:`,
              error
            );
          }
          muted[position] = "#F3F4F6";
        }
      } else {
        muted[position] = "#F3F4F6";
      }
    }

    // Generate border colors by mixing with background
    const background = colors.background || "#FFFFFF";
    for (const position of colorPositions) {
      const color = (colors as unknown as Record<string, string>)[position];
      if (color && typeof color === "string") {
        try {
          // Create border color by mixing with background
          borders[position] = chroma.mix(color, background, 0.85).hex();
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[ColorSystem] Failed to create border ${position}:`,
              error
            );
          }
          borders[position] = "#E5E7EB";
        }
      } else {
        borders[position] = "#E5E7EB";
      }
    }

    return { muted, borders };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generatePaletteVariations failed:", error);
    }
    return {
      muted: { primary: "#F3F4F6", secondary: "#F3F4F6", accent: "#F3F4F6" },
      borders: { primary: "#E5E7EB", secondary: "#E5E7EB", accent: "#E5E7EB" },
    };
  }
}

/**
 * Assemble the final ColorSystem from all generated components
 * @param baseColors - Base color system with primary, secondary, accent
 * @param background - Generated background color
 * @param text - Generated text color
 * @param variations - Muted and border color variations
 * @returns Complete ColorSystem
 */
function assembleColorSystem(
  baseColors: ColorSystem,
  background: string,
  text: string,
  variations: {
    muted: Record<string, string>;
    borders: Record<string, string>;
  }
): ColorSystem {
  try {
    // Input validation
    if (!baseColors || typeof baseColors !== "object") {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[ColorSystem] Invalid baseColors for assembleColorSystem"
        );
      }
      baseColors = {
        primary: "#3B82F6",
        secondary: "#6366F1",
        accent: "#8B5CF6",
        background: "#FFFFFF",
        text: "#111827",
        palette: {} as Record<string, string>,
      };
    }

    if (!background || typeof background !== "string") {
      background = "#FFFFFF";
    }

    if (!text || typeof text !== "string") {
      text = "#111827";
    }

    if (!variations || typeof variations !== "object") {
      variations = {
        muted: { primary: "#F3F4F6", secondary: "#F3F4F6", accent: "#F3F4F6" },
        borders: {
          primary: "#E5E7EB",
          secondary: "#E5E7EB",
          accent: "#E5E7EB",
        },
      };
    }

    // Assemble the complete color system
    const result: ColorSystem = {
      primary: baseColors.primary || "#3B82F6",
      secondary: baseColors.secondary || "#6366F1",
      accent: baseColors.accent || "#8B5CF6",
      background,
      text,
      palette: {
        primary: baseColors.primary || "#3B82F6",
        secondary: baseColors.secondary || "#6366F1",
        accent: baseColors.accent || "#8B5CF6",
        background,
        text,
        // Use the advanced muted and border generation from existing functions
        muted: generateMutedColor(background, text),
        border: generateBorderColor(background, text),
      },
    };

    // Validate the complete system
    const requiredProperties = [
      "primary",
      "secondary",
      "accent",
      "background",
      "text",
    ];
    for (const prop of requiredProperties) {
      if (
        !(prop in result) ||
        typeof (result as unknown as Record<string, string>)[prop] !== "string"
      ) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[ColorSystem] Missing or invalid ${prop} in assembled color system`
          );
        }
        // Set fallback
        (result as unknown as Record<string, string>)[prop] = "#808080";
      }
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] assembleColorSystem failed:", error);
    }
    // Return safe fallback
    return {
      primary: "#3B82F6",
      secondary: "#6366F1",
      accent: "#8B5CF6",
      background: "#FFFFFF",
      text: "#111827",
      palette: {
        primary: "#3B82F6",
        secondary: "#6366F1",
        accent: "#8B5CF6",
        background: "#FFFFFF",
        text: "#111827",
        muted: "#F3F4F6",
        border: "#E5E7EB",
      },
    };
  }
}

export function generateColorVariation(
  currentColors?: ColorSystem,
  options: ColorGenerationOptions = {}
): ColorSystem {
  // Input validation
  if (options !== null && typeof options !== "object") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid options for generateColorVariation",
        options
      );
    }
    options = {};
  }

  try {
    // Step 1: Extract pinned color data
    const { pinnedColors, baseHue, pinnedPositions } = extractPinnedColorData(
      currentColors || null,
      options
    );

    // Step 2: Generate harmony colors
    const effectiveBaseHue = baseHue ?? options.baseHue ?? getRandomHue();

    // Determine color scheme
    const colorScheme: ColorHarmony =
      options.colorScheme ??
      COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];

    const harmonyColors = generateHarmonyColors(
      effectiveBaseHue,
      colorScheme,
      pinnedPositions
    );

    // Step 3: Apply pinned colors
    const colorPositions = ["primary", "secondary", "accent"];
    const baseColors = applyPinnedColors(
      harmonyColors,
      pinnedColors,
      colorPositions
    );

    // Step 4: Generate background and text (respecting pinned values)
    const themePreference = options.backgroundThemePreference || "light";
    const { background: generatedBackground, text: generatedText } =
      generateBackgroundAndText(baseColors, themePreference);

    // Respect pinned background and text
    const finalBackground = pinnedColors.has("background")
      ? pinnedColors.get("background")!
      : generatedBackground;
    const finalText = pinnedColors.has("text")
      ? pinnedColors.get("text")!
      : generatedText;

    // Step 5: Generate variations
    const variations = generatePaletteVariations({
      ...baseColors,
      background: finalBackground,
      text: finalText,
    });

    // Step 6: Assemble final system
    return assembleColorSystem(
      baseColors,
      finalBackground,
      finalText,
      variations
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateColorVariation failed:", error);
      console.warn("[ColorSystem] Input params:", { currentColors, options });
    }
    // Return safe fallback ColorSystem
    return {
      primary: "#3B82F6",
      secondary: "#6366F1",
      accent: "#8B5CF6",
      background: "#FFFFFF",
      text: "#111827",
      palette: {
        primary: "#3B82F6",
        secondary: "#6366F1",
        accent: "#8B5CF6",
        background: "#FFFFFF",
        text: "#111827",
        muted: "#F3F4F6",
        border: "#E5E7EB",
      },
    };
  }
}

export function getRandomColorVariation(): ColorSystem {
  try {
    return generateColorVariation();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getRandomColorVariation failed:", error);
    }
    // Return safe fallback ColorSystem
    return {
      primary: "#3B82F6",
      secondary: "#6366F1",
      accent: "#8B5CF6",
      background: "#FFFFFF",
      text: "#111827",
      palette: {
        primary: "#3B82F6",
        secondary: "#6366F1",
        accent: "#8B5CF6",
        background: "#FFFFFF",
        text: "#111827",
        muted: "#F3F4F6",
        border: "#E5E7EB",
      },
    };
  }
}

/**
 * Generate a muted color that works well with the background and text
 * @param background - Background color
 * @param text - Text color
 * @returns Muted color for UI elements
 */
function generateMutedColor(background: string, text: string): string {
  // Input validation
  if (
    !background ||
    typeof background !== "string" ||
    !text ||
    typeof text !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for generateMutedColor", {
        background,
        text,
      });
    }
    return "#F3F4F6";
  }

  try {
    // Use chroma.mix instead of custom mix function
    const result = chroma
      .mix(
        background,
        text,
        COLOR_CONFIG.paletteVariations.muted.alphaValue,
        "lab" // Use LAB color space for perceptually uniform mixing
      )
      .hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid mix result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateMutedColor failed:", error);
      console.warn("[ColorSystem] Input params:", { background, text });
    }
    try {
      return chroma(background).luminance() > 0.5 ? "#F1F5F9" : "#334155";
    } catch {
      return "#F3F4F6";
    }
  }
}

/**
 * Generate a border color that provides subtle definition
 * @param background - Background color
 * @param text - Text color
 * @returns Border color for UI elements
 */
function generateBorderColor(background: string, text: string): string {
  // Input validation
  if (
    !background ||
    typeof background !== "string" ||
    !text ||
    typeof text !== "string"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid colors for generateBorderColor", {
        background,
        text,
      });
    }
    return "#E5E7EB";
  }

  try {
    // Create a more pronounced but still subtle variation using chroma.mix
    const backgroundLuminance = chroma(background).luminance();

    // Validate luminance
    if (isNaN(backgroundLuminance) || !isFinite(backgroundLuminance)) {
      throw new Error("Invalid background luminance");
    }

    const isLightBackground =
      backgroundLuminance >
      COLOR_CONFIG.textColors.backgroundLuminanceThreshold;
    const mixRatio = isLightBackground
      ? Math.abs(COLOR_CONFIG.paletteVariations.border.lightnessShift.light)
      : COLOR_CONFIG.paletteVariations.border.lightnessShift.dark;

    // Validate mixRatio
    if (isNaN(mixRatio) || !isFinite(mixRatio)) {
      throw new Error("Invalid mix ratio");
    }

    const result = chroma.mix(background, text, mixRatio, "lab").hex();

    // Validate result
    if (!result || typeof result !== "string") {
      throw new Error("Invalid mix result");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] generateBorderColor failed:", error);
      console.warn("[ColorSystem] Input params:", { background, text });
    }
    try {
      return chroma(background).luminance() > 0.5 ? "#E2E8F0" : "#475569";
    } catch {
      return "#E5E7EB";
    }
  }
}
