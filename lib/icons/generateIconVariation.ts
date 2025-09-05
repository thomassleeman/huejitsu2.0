import type { IconSystem } from "@/types/design-system";

// Different icon libraries and their characteristics
const ICON_LIBRARIES = [
  "lucide",
  "heroicons",
  "phosphor",
  "tabler",
  "feather",
  "remix",
  "carbon",
  "octicons",
] as const;

// Icon weight/style options
const ICON_WEIGHTS = [
  "thin",
  "light",
  "regular",
  "medium",
  "semibold",
  "bold",
] as const;

// Icon size scales for different use cases
const SIZE_SCALES = [
  // Compact scale
  [10, 12, 16, 20, 24, 32, 40],
  // Standard scale
  [12, 16, 20, 24, 32, 48, 64],
  // Generous scale
  [16, 20, 24, 32, 40, 56, 72],
  // Large scale
  [20, 24, 32, 40, 48, 64, 96],
  // Mixed scale
  [14, 18, 22, 28, 36, 52, 68],
  // Fibonacci-inspired
  [13, 16, 21, 34, 55, 89],
  // Material Design
  [18, 24, 36, 48],
  // Apple SF Symbols inspired
  [13, 17, 20, 23, 26, 30, 34],
];

// Style presets that work well together
const ICON_STYLE_PRESETS = [
  // Minimal style
  {
    library: "lucide" as const,
    weight: "light" as const,
    sizeScale: [12, 16, 20, 24, 32, 48, 64],
  },
  // Bold style
  {
    library: "heroicons" as const,
    weight: "bold" as const,
    sizeScale: [16, 20, 24, 32, 40, 56, 72],
  },
  // Friendly style
  {
    library: "phosphor" as const,
    weight: "regular" as const,
    sizeScale: [14, 18, 22, 28, 36, 52, 68],
  },
  // Professional style
  {
    library: "carbon" as const,
    weight: "regular" as const,
    sizeScale: [16, 20, 24, 32, 48, 64],
  },
  // Playful style
  {
    library: "tabler" as const,
    weight: "medium" as const,
    sizeScale: [18, 24, 36, 48],
  },
  // Tech style
  {
    library: "octicons" as const,
    weight: "regular" as const,
    sizeScale: [12, 16, 20, 24, 32, 48, 64],
  },
];

export interface IconVariationOptions {
  pinnedLibrary?: boolean;
  pinnedWeight?: boolean;
  pinnedSizeScale?: boolean;
  style?: "minimal" | "bold" | "friendly" | "professional" | "playful" | "tech";
  preferredLibraries?: (typeof ICON_LIBRARIES)[number][];
}

export function generateIconVariation(
  currentIcons?: IconSystem,
  options: IconVariationOptions = {}
): IconSystem {
  // If a specific style is requested, use that preset
  if (options.style) {
    const styleMap = {
      minimal: ICON_STYLE_PRESETS[0],
      bold: ICON_STYLE_PRESETS[1],
      friendly: ICON_STYLE_PRESETS[2],
      professional: ICON_STYLE_PRESETS[3],
      playful: ICON_STYLE_PRESETS[4],
      tech: ICON_STYLE_PRESETS[5],
    };
    return { ...styleMap[options.style] };
  }

  // Handle pinned properties
  let library: (typeof ICON_LIBRARIES)[number];
  let weight: (typeof ICON_WEIGHTS)[number];
  let sizeScale: number[];

  if (options.pinnedLibrary && currentIcons) {
    library = currentIcons.library as (typeof ICON_LIBRARIES)[number];
  } else {
    const availableLibraries = options.preferredLibraries || ICON_LIBRARIES;
    library =
      availableLibraries[Math.floor(Math.random() * availableLibraries.length)];
  }

  if (options.pinnedWeight && currentIcons) {
    weight = currentIcons.weight as (typeof ICON_WEIGHTS)[number];
  } else {
    weight = ICON_WEIGHTS[Math.floor(Math.random() * ICON_WEIGHTS.length)];
  }

  if (options.pinnedSizeScale && currentIcons) {
    sizeScale = [...currentIcons.sizeScale];
  } else {
    sizeScale = [
      ...SIZE_SCALES[Math.floor(Math.random() * SIZE_SCALES.length)],
    ];
  }

  // If no constraints, sometimes use a preset for better coherence
  if (!Object.values(options).some(Boolean) && Math.random() < 0.3) {
    const randomPreset =
      ICON_STYLE_PRESETS[Math.floor(Math.random() * ICON_STYLE_PRESETS.length)];
    return { ...randomPreset };
  }

  return {
    library,
    weight,
    sizeScale,
  };
}

export function getRandomIconVariation(): IconSystem {
  return generateIconVariation();
}

