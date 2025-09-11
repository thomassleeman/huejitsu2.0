// Only use chroma-js types, no direct color manipulation in this file

export const COLOR_CONFIG = {
  // Background Theme Ranges
  backgroundThemes: {
    light: {
      lightness: {
        min: 0.85, // 85% - Minimum lightness for light backgrounds
        max: 0.98, // 98% - Maximum lightness for light backgrounds
        default: 0.92, // 92% - Default if no variation needed
      },
      saturation: {
        min: 0.02, // 2% - Minimum saturation (slight tint)
        max: 0.15, // 15% - Maximum saturation (noticeable but subtle)
        default: 0.08, // 8% - Default saturation
      },
      hueVariation: 10, // ±10 degrees from base hue
    },
    dark: {
      lightness: {
        min: 0.02, // 2% - Minimum lightness for dark backgrounds
        max: 0.18, // 18% - Maximum lightness for dark backgrounds
        default: 0.1, // 10% - Default if no variation needed
      },
      saturation: {
        min: 0.02, // 2% - Minimum saturation (slight tint)
        max: 0.2, // 20% - Maximum saturation (more allowed in dark)
        default: 0.1, // 10% - Default saturation
      },
      hueVariation: 10, // ±10 degrees from base hue
    },
  },

  // Harmony Generation Defaults
  harmonyDefaults: {
    saturation: {
      min: 0.6, // 60% - Minimum saturation for harmony colors
      max: 0.9, // 90% - Maximum saturation for harmony colors
      default: 0.75, // 75% - Default saturation
      variation: 0.15, // ±15% variation between colors in a scheme
    },
    lightness: {
      min: 0.4, // 40% - Minimum lightness for harmony colors
      max: 0.65, // 65% - Maximum lightness for harmony colors
      default: 0.52, // 52% - Default lightness
      variation: 0.1, // ±10% variation between colors in a scheme
    },
  },

  // WCAG Contrast Requirements
  contrastRequirements: {
    AA: {
      normal: 4.5, // Normal text
      large: 3.0, // Large text (18pt+ or 14pt+ bold)
    },
    AAA: {
      normal: 7.0, // Normal text
      large: 4.5, // Large text
    },
    // Default target for generated text/background pairs
    defaultTarget: "AA" as const,
    // Minimum contrast for any text/background combination
    absoluteMinimum: 3.0,
  },

  // Text Color Generation
  textColors: {
    // Lightness thresholds for determining text color
    backgroundLuminanceThreshold: 0.5, // Switch point between light/dark text

    // For light backgrounds (dark text)
    darkText: {
      lightness: {
        min: 0.1, // 10% - Darkest text
        max: 0.25, // 25% - Lightest "dark" text
        default: 0.15, // 15% - Default dark text
      },
      saturation: {
        min: 0.05, // 5% - Nearly neutral
        max: 0.15, // 15% - Slightly tinted
        default: 0.08, // 8% - Subtle tint
      },
    },

    // For dark backgrounds (light text)
    lightText: {
      lightness: {
        min: 0.85, // 85% - Darkest "light" text
        max: 0.98, // 98% - Brightest text
        default: 0.94, // 94% - Default light text
      },
      saturation: {
        min: 0.02, // 2% - Nearly neutral
        max: 0.1, // 10% - Slightly tinted
        default: 0.05, // 5% - Very subtle tint
      },
    },
  },

  // Palette Variations (muted, borders, etc.)
  paletteVariations: {
    muted: {
      saturationMultiplier: 0.3, // 30% of original saturation
      lightnessShift: 0.15, // Shift towards neutral by 15%
      alphaValue: 0.15, // 15% opacity when used as overlay
    },
    border: {
      saturationMultiplier: 0.2, // 20% of original saturation
      lightnessShift: {
        light: -0.15, // Darker by 15% for light themes
        dark: 0.15, // Lighter by 15% for dark themes
      },
    },
  },

  // Color Space Configuration
  colorSpace: {
    default: "lab" as const, // Use LAB for perceptual uniformity
    mixing: "lch" as const, // Use LCH for color mixing
    interpolation: "lab" as const, // Use LAB for gradients
  },

  // Generation Constraints
  constraints: {
    maxGenerationAttempts: 10, // Max attempts to generate valid colors
    colorDistinctiveness: 15, // Minimum hue difference between colors (degrees)
    saturationFloor: 0.1, // Never go below 10% saturation for main colors
    lightnessFloor: 0.15, // Never go below 15% lightness
    lightnessCeiling: 0.85, // Never go above 85% lightness
  },
} as const;

// Type exports for use in other modules
export type ColorConfig = typeof COLOR_CONFIG;
export type ThemeType = keyof typeof COLOR_CONFIG.backgroundThemes;
export type ContrastLevel = keyof typeof COLOR_CONFIG.contrastRequirements;

/**
 * Get a random value within a range
 */
export function getRandomInRange(min: number, max: number): number {
  // Input validation
  if (typeof min !== "number" || isNaN(min) || !isFinite(min)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid min for getRandomInRange", min);
    }
    min = 0;
  }

  if (typeof max !== "number" || isNaN(max) || !isFinite(max)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid max for getRandomInRange", max);
    }
    max = 100;
  }

  // Ensure min <= max
  if (min > max) {
    [min, max] = [max, min];
  }

  try {
    const result = min + Math.random() * (max - min);

    // Validate result
    if (isNaN(result) || !isFinite(result)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid result from getRandomInRange", {
          min,
          max,
          result,
        });
      }
      return min;
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getRandomInRange failed:", error);
      console.warn("[ColorSystem] Input params:", { min, max });
    }
    return min;
  }
}

/**
 * Get a value with variation applied
 */
export function applyVariation(base: number, variation: number): number {
  // Input validation
  if (typeof base !== "number" || isNaN(base) || !isFinite(base)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid base for applyVariation", base);
    }
    base = 0.5;
  }

  if (
    typeof variation !== "number" ||
    isNaN(variation) ||
    !isFinite(variation)
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid variation for applyVariation",
        variation
      );
    }
    variation = 0;
  }

  try {
    const delta = (Math.random() - 0.5) * 2 * variation;
    const result = Math.max(0, Math.min(1, base + delta));

    // Validate result
    if (isNaN(result) || !isFinite(result)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid result from applyVariation", {
          base,
          variation,
          result,
        });
      }
      return Math.max(0, Math.min(1, base));
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] applyVariation failed:", error);
      console.warn("[ColorSystem] Input params:", { base, variation });
    }
    return Math.max(0, Math.min(1, base));
  }
}

/**
 * Get theme-appropriate configuration
 */
export function getThemeConfig(theme: ThemeType | "random") {
  // Input validation
  if (!theme || (theme !== "light" && theme !== "dark" && theme !== "random")) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] Invalid theme for getThemeConfig", theme);
    }
    theme = "light";
  }

  try {
    if (theme === "random") {
      return Math.random() > 0.5
        ? COLOR_CONFIG.backgroundThemes.light
        : COLOR_CONFIG.backgroundThemes.dark;
    }

    const config = COLOR_CONFIG.backgroundThemes[theme];

    if (!config || typeof config !== "object") {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ColorSystem] Invalid config for theme", theme);
      }
      return COLOR_CONFIG.backgroundThemes.light;
    }

    return config;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getThemeConfig failed:", error);
      console.warn("[ColorSystem] Input params:", { theme });
    }
    return COLOR_CONFIG.backgroundThemes.light;
  }
}

/**
 * Get contrast requirement for a given level
 */
export function getContrastRequirement(
  level: ContrastLevel = "AA",
  isLargeText: boolean = false
): number {
  // Input validation
  if (!level || (level !== "AA" && level !== "AAA")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid level for getContrastRequirement",
        level
      );
    }
    level = "AA";
  }

  if (typeof isLargeText !== "boolean") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ColorSystem] Invalid isLargeText for getContrastRequirement",
        isLargeText
      );
    }
    isLargeText = false;
  }

  try {
    if (level === "AA") {
      const requirements = COLOR_CONFIG.contrastRequirements.AA;
      return isLargeText ? requirements.large : requirements.normal;
    } else if (level === "AAA") {
      const requirements = COLOR_CONFIG.contrastRequirements.AAA;
      return isLargeText ? requirements.large : requirements.normal;
    }
    // fallback
    return COLOR_CONFIG.contrastRequirements.absoluteMinimum;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ColorSystem] getContrastRequirement failed:", error);
      console.warn("[ColorSystem] Input params:", { level, isLargeText });
    }
    return COLOR_CONFIG.contrastRequirements.absoluteMinimum;
  }
}
