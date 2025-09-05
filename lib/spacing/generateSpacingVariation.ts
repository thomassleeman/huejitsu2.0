import type { SpacingSystem } from "@/types/design-system";

// Different spacing scale ratios and base units
const SPACING_SYSTEMS = [
  // Fibonacci-inspired system
  {
    baseUnit: 8,
    scale: [2, 4, 8, 12, 16, 24, 32, 48, 64, 96],
    tokens: {
      xs: "2px",
      sm: "4px",
      md: "8px",
      lg: "16px",
      xl: "24px",
      "2xl": "32px",
      "3xl": "48px",
      "4xl": "64px",
      "5xl": "96px",
    },
  },
  // Perfect powers system
  {
    baseUnit: 4,
    scale: [4, 8, 16, 32, 64, 128],
    tokens: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "32px",
      xl: "64px",
      "2xl": "128px",
      "3xl": "256px",
      "4xl": "384px",
      "5xl": "512px",
    },
  },
  // Modular scale (1.5 ratio)
  {
    baseUnit: 6,
    scale: [6, 9, 14, 21, 32, 48, 72, 108],
    tokens: {
      xs: "6px",
      sm: "9px",
      md: "14px",
      lg: "21px",
      xl: "32px",
      "2xl": "48px",
      "3xl": "72px",
      "4xl": "108px",
      "5xl": "162px",
    },
  },
  // Golden ratio system (1.618)
  {
    baseUnit: 8,
    scale: [5, 8, 13, 21, 34, 55, 89],
    tokens: {
      xs: "5px",
      sm: "8px",
      md: "13px",
      lg: "21px",
      xl: "34px",
      "2xl": "55px",
      "3xl": "89px",
      "4xl": "144px",
      "5xl": "233px",
    },
  },
  // Compact system
  {
    baseUnit: 4,
    scale: [2, 4, 6, 8, 12, 16, 20, 24, 32],
    tokens: {
      xs: "2px",
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
      "3xl": "20px",
      "4xl": "24px",
      "5xl": "32px",
    },
  },
  // Generous system
  {
    baseUnit: 12,
    scale: [6, 12, 18, 24, 36, 48, 72, 96, 144],
    tokens: {
      xs: "6px",
      sm: "12px",
      md: "18px",
      lg: "24px",
      xl: "36px",
      "2xl": "48px",
      "3xl": "72px",
      "4xl": "96px",
      "5xl": "144px",
    },
  },
  // Material Design inspired
  {
    baseUnit: 8,
    scale: [4, 8, 16, 24, 32, 40, 48, 56, 64],
    tokens: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
      "2xl": "40px",
      "3xl": "48px",
      "4xl": "56px",
      "5xl": "64px",
    },
  },
  // Apple HIG inspired
  {
    baseUnit: 8,
    scale: [4, 8, 12, 16, 20, 24, 32, 44, 60],
    tokens: {
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "44px",
      "5xl": "60px",
    },
  },
];

export interface SpacingVariationOptions {
  pinnedBaseUnit?: boolean;
  pinnedScale?: boolean;
  minBaseUnit?: number;
  maxBaseUnit?: number;
}

export function generateSpacingVariation(
  currentSpacing?: SpacingSystem,
  options: SpacingVariationOptions = {}
): SpacingSystem {
  let selectedSystem;

  if (options.pinnedBaseUnit && currentSpacing) {
    // Find systems with similar base unit
    const targetBase = currentSpacing.baseUnit;
    const matchingSystems = SPACING_SYSTEMS.filter(
      (system) => Math.abs(system.baseUnit - targetBase) <= 2
    );
    selectedSystem =
      matchingSystems.length > 0
        ? matchingSystems[Math.floor(Math.random() * matchingSystems.length)]
        : SPACING_SYSTEMS[Math.floor(Math.random() * SPACING_SYSTEMS.length)];
  } else if (options.pinnedScale && currentSpacing) {
    // Keep current system but maybe adjust base unit slightly
    const baseVariation = options.pinnedBaseUnit
      ? 0
      : Math.floor(Math.random() * 5) - 2;
    const newBaseUnit = Math.max(
      4,
      Math.min(16, currentSpacing.baseUnit + baseVariation)
    );

    return {
      ...currentSpacing,
      baseUnit: newBaseUnit,
      tokens: {
        ...currentSpacing.tokens,
        xs: `${Math.max(2, Math.floor(newBaseUnit * 0.5))}px`,
        sm: `${newBaseUnit}px`,
        md: `${newBaseUnit * 2}px`,
        lg: `${newBaseUnit * 3}px`,
        xl: `${newBaseUnit * 4}px`,
        "2xl": `${newBaseUnit * 6}px`,
        "3xl": `${newBaseUnit * 8}px`,
        "4xl": `${newBaseUnit * 12}px`,
        "5xl": `${newBaseUnit * 16}px`,
      },
    };
  } else {
    // Random system selection
    selectedSystem =
      SPACING_SYSTEMS[Math.floor(Math.random() * SPACING_SYSTEMS.length)];
  }

  // Apply constraints if specified
  if (options.minBaseUnit || options.maxBaseUnit) {
    const min = options.minBaseUnit || 2;
    const max = options.maxBaseUnit || 20;

    if (selectedSystem.baseUnit < min || selectedSystem.baseUnit > max) {
      // Find a system within constraints
      const validSystems = SPACING_SYSTEMS.filter(
        (system) => system.baseUnit >= min && system.baseUnit <= max
      );

      if (validSystems.length > 0) {
        selectedSystem =
          validSystems[Math.floor(Math.random() * validSystems.length)];
      }
    }
  }

  return { ...selectedSystem };
}

export function getRandomSpacingVariation(): SpacingSystem {
  return generateSpacingVariation();
}

