// Design system state atoms using Jotai
// Following the architecture outlined in state.md

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type {
  ColorSystem,
  TypographySystem,
  SpacingSystem,
  ComponentSystem,
  IconSystem,
  ColorHarmony,
  ContrastRatio,
} from "@/types/design-system";
import type { ColorSchemeType } from "@/lib/color/harmony-algorithms";

// Creative iteration history types
interface HistoryItem<T> {
  data: T;
  timestamp: number;
}

interface IterationState<T> {
  history: HistoryItem<T>[];
  currentIndex: number;
  maxHistorySize: number;
}

interface PinningState {
  colors: {
    primary: boolean;
    secondary: boolean;
    accent: boolean;
    background: boolean;
    text: boolean;
  };
  typography: {
    primaryFont: boolean;
    secondaryFont: boolean;
    typeScale: boolean;
  };
  spacing: {
    baseUnit: boolean;
    scale: boolean;
    tokens: boolean;
  };
  components: {
    borderRadius: boolean;
    borderWidth: boolean;
    shadowStyle: boolean;
    opacityLevels: boolean;
  };
  icons: {
    library: boolean;
    weight: boolean;
    sizeScale: boolean;
  };
}

// Base atoms with automatic localStorage persistence
export const colorsAtom = atomWithStorage<ColorSystem>("huejitsu-colors", {
  primary: "#3B82F6",
  secondary: "#10B981",
  accent: "#F59E0B",
  background: "#FFFFFF",
  text: "#111827",
  palette: {},
});

export const typographyAtom = atomWithStorage<TypographySystem>(
  "huejitsu-typography",
  {
    primaryFont: "Inter",
    secondaryFont: "Roboto Mono",
    typeScale: {
      h1: { fontSize: "2.5rem", lineHeight: "1.2" },
      h2: { fontSize: "2rem", lineHeight: "1.3" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4" },
      h4: { fontSize: "1.25rem", lineHeight: "1.5" },
      h5: { fontSize: "1.125rem", lineHeight: "1.5" },
      h6: { fontSize: "1rem", lineHeight: "1.5" },
      body: { fontSize: "1rem", lineHeight: "1.6" },
      caption: { fontSize: "0.875rem", lineHeight: "1.4" },
    },
  }
);

export const spacingAtom = atomWithStorage<SpacingSystem>("huejitsu-spacing", {
  baseUnit: 8,
  scale: [4, 8, 16, 24, 32, 48, 64, 96, 128],
  tokens: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "96px",
    "5xl": "128px",
  },
});

export const componentsAtom = atomWithStorage<ComponentSystem>(
  "huejitsu-components",
  {
    borderRadius: 8,
    borderWidth: 1,
    shadowStyle: "subtle",
    opacityLevels: [0.1, 0.25, 0.5, 0.75, 0.9],
  }
);

export const iconsAtom = atomWithStorage<IconSystem>("huejitsu-icons", {
  library: "lucide",
  weight: "regular",
  sizeScale: [12, 16, 20, 24, 32, 48, 64],
});

// Color scheme selection atom
export const colorSchemeAtom = atomWithStorage<ColorSchemeType | "random">(
  "huejitsu-color-scheme",
  "random"
);

// Background theme preference atom
export const backgroundThemePreferenceAtom = atomWithStorage<
  "light" | "dark" | "random"
>("huejitsu-background-theme-preference", "random");

// Creative iteration atoms
export const pinningStateAtom = atomWithStorage<PinningState>(
  "huejitsu-pinning",
  {
    colors: {
      primary: false,
      secondary: false,
      accent: false,
      background: false,
      text: false,
    },
    typography: {
      primaryFont: false,
      secondaryFont: false,
      typeScale: false,
    },
    spacing: {
      baseUnit: false,
      scale: false,
      tokens: false,
    },
    components: {
      borderRadius: false,
      borderWidth: false,
      shadowStyle: false,
      opacityLevels: false,
    },
    icons: {
      library: false,
      weight: false,
      sizeScale: false,
    },
  }
);

// Iteration history atoms (in memory only, not persisted)
export const colorsIterationAtom = atom<IterationState<ColorSystem>>({
  history: [],
  currentIndex: -1,
  maxHistorySize: 50,
});

export const typographyIterationAtom = atom<IterationState<TypographySystem>>({
  history: [],
  currentIndex: -1,
  maxHistorySize: 50,
});

export const spacingIterationAtom = atom<IterationState<SpacingSystem>>({
  history: [],
  currentIndex: -1,
  maxHistorySize: 50,
});

export const componentsIterationAtom = atom<IterationState<ComponentSystem>>({
  history: [],
  currentIndex: -1,
  maxHistorySize: 50,
});

export const iconsIterationAtom = atom<IterationState<IconSystem>>({
  history: [],
  currentIndex: -1,
  maxHistorySize: 50,
});

// Derived atoms that automatically update when dependencies change
export const colorHarmonyAtom = atom<ColorHarmony>((get) => {
  const colors = get(colorsAtom);
  // TODO: Implement actual harmony generation algorithms
  // For now, return placeholder values
  return {
    triadic: [colors.primary, "#FF6B6B", "#4ECDC4"],
    tetradic: [colors.primary, "#FF6B6B", "#4ECDC4", "#95E1D3"],
    complementary: [colors.primary, "#FF6B6B"],
    analogous: [colors.primary, "#5A67D8", "#667EEA"],
  };
});

export const contrastRatiosAtom = atom<Record<string, ContrastRatio>>((get) => {
  const colors = get(colorsAtom);
  // TODO: Implement actual contrast ratio calculations
  // For now, return placeholder values
  return {
    primaryOnBackground: { ratio: 4.5, level: "AA" },
    textOnPrimary: { ratio: 7.2, level: "AAA" },
    secondaryOnBackground: { ratio: 3.8, level: "AA" },
    accentOnBackground: { ratio: 5.1, level: "AA" },
  };
});

// CSS custom properties generator - the heart of the live preview system
export const previewCSSAtom = atom<Record<string, string>>((get) => {
  const colors = get(colorsAtom);
  const typography = get(typographyAtom);
  const spacing = get(spacingAtom);
  const components = get(componentsAtom);

  return {
    // Color variables
    "--primary-color": colors.primary,
    "--secondary-color": colors.secondary,
    "--accent-color": colors.accent,
    "--background-color": colors.background,
    "--text-color": colors.text,

    // Typography variables
    "--font-primary": typography.primaryFont,
    "--font-secondary": typography.secondaryFont,
    "--text-h1": typography.typeScale.h1.fontSize,
    "--line-height-h1": typography.typeScale.h1.lineHeight,
    "--text-h2": typography.typeScale.h2.fontSize,
    "--line-height-h2": typography.typeScale.h2.lineHeight,
    "--text-h3": typography.typeScale.h3.fontSize,
    "--line-height-h3": typography.typeScale.h3.lineHeight,
    "--text-body": typography.typeScale.body.fontSize,
    "--line-height-body": typography.typeScale.body.lineHeight,

    // Spacing variables
    "--spacing-base": `${spacing.baseUnit}px`,
    "--spacing-xs": spacing.tokens.xs,
    "--spacing-sm": spacing.tokens.sm,
    "--spacing-md": spacing.tokens.md,
    "--spacing-lg": spacing.tokens.lg,
    "--spacing-xl": spacing.tokens.xl,

    // Component variables
    "--border-radius": `${components.borderRadius}px`,
    "--border-width": `${components.borderWidth}px`,
    "--shadow-style": components.shadowStyle,
  };
});

// Export data atom - generates all export formats
export const exportDataAtom = atom((get) => {
  const colors = get(colorsAtom);
  const typography = get(typographyAtom);
  const spacing = get(spacingAtom);
  const components = get(componentsAtom);
  const icons = get(iconsAtom);

  const designTokens = {
    colors,
    typography,
    spacing,
    components,
    icons,
  };

  return {
    // TODO: Implement actual export generators
    tailwind: JSON.stringify(designTokens, null, 2), // Placeholder
    css: JSON.stringify(designTokens, null, 2), // Placeholder
    shadcn: JSON.stringify(designTokens, null, 2), // Placeholder
    scss: JSON.stringify(designTokens, null, 2), // Placeholder
    js: JSON.stringify(designTokens, null, 2), // Placeholder
    json: designTokens,
  };
});
