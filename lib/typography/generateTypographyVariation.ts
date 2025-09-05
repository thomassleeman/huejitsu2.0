import type { TypographySystem } from "@/types/design-system";

// Available font combinations with good pairing
const FONT_COMBINATIONS = [
  // Sans-serif combinations
  { primary: "Inter", secondary: "Inter" },
  { primary: "Roboto", secondary: "Roboto Mono" },
  { primary: "Open Sans", secondary: "Source Code Pro" },
  { primary: "Lato", secondary: "Inconsolata" },
  { primary: "Montserrat", secondary: "Roboto Mono" },
  { primary: "Poppins", secondary: "Fira Code" },
  { primary: "Raleway", secondary: "Space Mono" },
  { primary: "Source Sans Pro", secondary: "JetBrains Mono" },

  // Serif combinations
  { primary: "Playfair Display", secondary: "Source Sans Pro" },
  { primary: "Merriweather", secondary: "Inter" },
  { primary: "Crimson Text", secondary: "Lato" },
  { primary: "Libre Baskerville", secondary: "Open Sans" },

  // Mixed combinations for variety
  { primary: "Oswald", secondary: "Roboto" },
  { primary: "Nunito", secondary: "Nunito Sans" },
  { primary: "Work Sans", secondary: "Work Sans" },
  { primary: "Quicksand", secondary: "Inter" },
];

// Different type scales following design principles
const TYPE_SCALES = [
  // Classic scale (1.25 ratio)
  {
    h1: { fontSize: "3rem", lineHeight: "1.1" },
    h2: { fontSize: "2.25rem", lineHeight: "1.2" },
    h3: { fontSize: "1.875rem", lineHeight: "1.3" },
    h4: { fontSize: "1.5rem", lineHeight: "1.4" },
    h5: { fontSize: "1.25rem", lineHeight: "1.5" },
    h6: { fontSize: "1.125rem", lineHeight: "1.5" },
    body: { fontSize: "1rem", lineHeight: "1.6" },
    caption: { fontSize: "0.875rem", lineHeight: "1.4" },
  },
  // Major third scale (1.25 ratio, different base)
  {
    h1: { fontSize: "2.5rem", lineHeight: "1.2" },
    h2: { fontSize: "2rem", lineHeight: "1.3" },
    h3: { fontSize: "1.6rem", lineHeight: "1.4" },
    h4: { fontSize: "1.28rem", lineHeight: "1.5" },
    h5: { fontSize: "1.024rem", lineHeight: "1.5" },
    h6: { fontSize: "1rem", lineHeight: "1.5" },
    body: { fontSize: "1rem", lineHeight: "1.6" },
    caption: { fontSize: "0.8rem", lineHeight: "1.4" },
  },
  // Perfect fourth scale (1.333 ratio)
  {
    h1: { fontSize: "3.157rem", lineHeight: "1.1" },
    h2: { fontSize: "2.369rem", lineHeight: "1.2" },
    h3: { fontSize: "1.777rem", lineHeight: "1.3" },
    h4: { fontSize: "1.333rem", lineHeight: "1.4" },
    h5: { fontSize: "1rem", lineHeight: "1.5" },
    h6: { fontSize: "0.75rem", lineHeight: "1.5" },
    body: { fontSize: "1rem", lineHeight: "1.6" },
    caption: { fontSize: "0.75rem", lineHeight: "1.4" },
  },
  // Minor third scale (1.2 ratio)
  {
    h1: { fontSize: "2.488rem", lineHeight: "1.2" },
    h2: { fontSize: "2.074rem", lineHeight: "1.2" },
    h3: { fontSize: "1.728rem", lineHeight: "1.3" },
    h4: { fontSize: "1.44rem", lineHeight: "1.4" },
    h5: { fontSize: "1.2rem", lineHeight: "1.5" },
    h6: { fontSize: "1rem", lineHeight: "1.5" },
    body: { fontSize: "1rem", lineHeight: "1.6" },
    caption: { fontSize: "0.833rem", lineHeight: "1.4" },
  },
  // Compact scale
  {
    h1: { fontSize: "2rem", lineHeight: "1.3" },
    h2: { fontSize: "1.75rem", lineHeight: "1.3" },
    h3: { fontSize: "1.5rem", lineHeight: "1.4" },
    h4: { fontSize: "1.25rem", lineHeight: "1.4" },
    h5: { fontSize: "1.125rem", lineHeight: "1.5" },
    h6: { fontSize: "1rem", lineHeight: "1.5" },
    body: { fontSize: "0.875rem", lineHeight: "1.6" },
    caption: { fontSize: "0.75rem", lineHeight: "1.4" },
  },
  // Large scale
  {
    h1: { fontSize: "4rem", lineHeight: "1.1" },
    h2: { fontSize: "3rem", lineHeight: "1.1" },
    h3: { fontSize: "2.25rem", lineHeight: "1.2" },
    h4: { fontSize: "1.875rem", lineHeight: "1.3" },
    h5: { fontSize: "1.5rem", lineHeight: "1.4" },
    h6: { fontSize: "1.25rem", lineHeight: "1.5" },
    body: { fontSize: "1.125rem", lineHeight: "1.6" },
    caption: { fontSize: "1rem", lineHeight: "1.4" },
  },
];

export interface TypographyVariationOptions {
  pinnedFont?: "primary" | "secondary";
  pinnedScale?: boolean;
}

export function generateTypographyVariation(
  currentTypography?: TypographySystem,
  options: TypographyVariationOptions = {}
): TypographySystem {
  // Choose font combination
  let fontCombo;
  if (options.pinnedFont === "primary" && currentTypography) {
    // Find combinations with the same primary font
    const matchingCombos = FONT_COMBINATIONS.filter(
      (combo) => combo.primary === currentTypography.primaryFont
    );
    fontCombo =
      matchingCombos[Math.floor(Math.random() * matchingCombos.length)] ||
      FONT_COMBINATIONS[0];
  } else if (options.pinnedFont === "secondary" && currentTypography) {
    // Find combinations with the same secondary font
    const matchingCombos = FONT_COMBINATIONS.filter(
      (combo) => combo.secondary === currentTypography.secondaryFont
    );
    fontCombo =
      matchingCombos[Math.floor(Math.random() * matchingCombos.length)] ||
      FONT_COMBINATIONS[0];
  } else {
    // Random font combination
    fontCombo =
      FONT_COMBINATIONS[Math.floor(Math.random() * FONT_COMBINATIONS.length)];
  }

  // Choose type scale
  let typeScale;
  if (options.pinnedScale && currentTypography) {
    typeScale = currentTypography.typeScale;
  } else {
    typeScale = TYPE_SCALES[Math.floor(Math.random() * TYPE_SCALES.length)];
  }

  return {
    primaryFont: fontCombo.primary,
    secondaryFont: fontCombo.secondary,
    typeScale,
  };
}

export function getRandomTypographyVariation(): TypographySystem {
  return generateTypographyVariation();
}

