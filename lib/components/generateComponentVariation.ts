import type { ComponentSystem } from "@/types/design-system";

// Different component aesthetic styles
const COMPONENT_STYLES = [
  // Minimal/Clean
  {
    borderRadius: 4,
    borderWidth: 1,
    shadowStyle: "none" as const,
    opacityLevels: [0.05, 0.1, 0.2, 0.4, 0.6],
  },
  // Soft/Rounded
  {
    borderRadius: 12,
    borderWidth: 1,
    shadowStyle: "soft" as const,
    opacityLevels: [0.1, 0.2, 0.3, 0.5, 0.7],
  },
  // Bold/Geometric
  {
    borderRadius: 0,
    borderWidth: 2,
    shadowStyle: "bold" as const,
    opacityLevels: [0.15, 0.25, 0.4, 0.6, 0.8],
  },
  // Organic/Natural
  {
    borderRadius: 16,
    borderWidth: 0,
    shadowStyle: "natural" as const,
    opacityLevels: [0.08, 0.15, 0.25, 0.45, 0.65],
  },
  // Modern/Crisp
  {
    borderRadius: 8,
    borderWidth: 1,
    shadowStyle: "crisp" as const,
    opacityLevels: [0.1, 0.2, 0.35, 0.55, 0.75],
  },
  // Classic/Traditional
  {
    borderRadius: 6,
    borderWidth: 1,
    shadowStyle: "subtle" as const,
    opacityLevels: [0.1, 0.25, 0.4, 0.6, 0.8],
  },
  // Playful/Fun
  {
    borderRadius: 20,
    borderWidth: 2,
    shadowStyle: "playful" as const,
    opacityLevels: [0.12, 0.24, 0.36, 0.58, 0.8],
  },
  // Corporate/Professional
  {
    borderRadius: 4,
    borderWidth: 1,
    shadowStyle: "professional" as const,
    opacityLevels: [0.08, 0.16, 0.32, 0.48, 0.72],
  },
  // Tech/Digital
  {
    borderRadius: 2,
    borderWidth: 1,
    shadowStyle: "digital" as const,
    opacityLevels: [0.1, 0.2, 0.3, 0.5, 0.7],
  },
  // Warm/Friendly
  {
    borderRadius: 14,
    borderWidth: 1,
    shadowStyle: "warm" as const,
    opacityLevels: [0.12, 0.22, 0.34, 0.52, 0.74],
  },
];

// Individual property variations for more granular control
const BORDER_RADIUS_OPTIONS = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24];
const BORDER_WIDTH_OPTIONS = [0, 1, 2, 3];
const SHADOW_STYLES = [
  "none",
  "subtle",
  "soft",
  "bold",
  "natural",
  "crisp",
  "playful",
  "professional",
  "digital",
  "warm",
] as const;

export interface ComponentVariationOptions {
  pinnedBorderRadius?: boolean;
  pinnedBorderWidth?: boolean;
  pinnedShadowStyle?: boolean;
  pinnedOpacity?: boolean;
  style?:
    | "minimal"
    | "soft"
    | "bold"
    | "organic"
    | "modern"
    | "classic"
    | "playful"
    | "corporate"
    | "tech"
    | "warm";
}

export function generateComponentVariation(
  currentComponents?: ComponentSystem,
  options: ComponentVariationOptions = {}
): ComponentSystem {
  // If a specific style is requested, use that
  if (options.style) {
    const styleMap = {
      minimal: COMPONENT_STYLES[0],
      soft: COMPONENT_STYLES[1],
      bold: COMPONENT_STYLES[2],
      organic: COMPONENT_STYLES[3],
      modern: COMPONENT_STYLES[4],
      classic: COMPONENT_STYLES[5],
      playful: COMPONENT_STYLES[6],
      corporate: COMPONENT_STYLES[7],
      tech: COMPONENT_STYLES[8],
      warm: COMPONENT_STYLES[9],
    };
    return { ...styleMap[options.style] };
  }

  // Handle pinned properties
  let borderRadius: number;
  let borderWidth: number;
  let shadowStyle: (typeof SHADOW_STYLES)[number];
  let opacityLevels: number[];

  if (options.pinnedBorderRadius && currentComponents) {
    borderRadius = currentComponents.borderRadius;
  } else {
    borderRadius =
      BORDER_RADIUS_OPTIONS[
        Math.floor(Math.random() * BORDER_RADIUS_OPTIONS.length)
      ];
  }

  if (options.pinnedBorderWidth && currentComponents) {
    borderWidth = currentComponents.borderWidth;
  } else {
    borderWidth =
      BORDER_WIDTH_OPTIONS[
        Math.floor(Math.random() * BORDER_WIDTH_OPTIONS.length)
      ];
  }

  if (options.pinnedShadowStyle && currentComponents) {
    shadowStyle = currentComponents.shadowStyle;
  } else {
    shadowStyle =
      SHADOW_STYLES[Math.floor(Math.random() * SHADOW_STYLES.length)];
  }

  if (options.pinnedOpacity && currentComponents) {
    opacityLevels = [...currentComponents.opacityLevels];
  } else {
    // Generate harmonious opacity levels
    const baseOpacity = 0.05 + Math.random() * 0.1; // 0.05 to 0.15
    opacityLevels = [
      baseOpacity,
      baseOpacity * 2,
      baseOpacity * 4,
      baseOpacity * 6,
      baseOpacity * 8,
    ].map((o) => Math.min(0.9, Math.round(o * 100) / 100));
  }

  // If no specific constraints, sometimes use a pre-defined style for coherence
  if (!Object.values(options).some(Boolean) && Math.random() < 0.4) {
    const randomStyle =
      COMPONENT_STYLES[Math.floor(Math.random() * COMPONENT_STYLES.length)];
    return { ...randomStyle };
  }

  return {
    borderRadius,
    borderWidth,
    shadowStyle,
    opacityLevels,
  };
}

export function getRandomComponentVariation(): ComponentSystem {
  return generateComponentVariation();
}

