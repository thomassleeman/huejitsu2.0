import chroma from "chroma-js";
import type { ColorSystem } from "@/types/design-system";
import {
  calculateContrast,
  checkAACompliance,
  checkAAACompliance,
} from "./contrast-calculator";
import { validateColorSystem } from "./semantic-mapping";

/**
 * Comprehensive accessibility analysis for color systems
 * Provides detailed accessibility reports, color blindness testing, and improvement suggestions
 */

export interface AccessibilityReport {
  overall: "excellent" | "good" | "fair" | "poor";
  score: number; // 0-100
  wcagAA: ComplianceReport;
  wcagAAA: ComplianceReport;
  colorBlindness: ColorBlindnessReport;
  improvements: AccessibilityImprovement[];
}

export interface ComplianceReport {
  passes: ColorPair[];
  fails: ColorPair[];
  warnings: ColorPair[];
}

export interface ColorPair {
  foreground: string;
  background: string;
  ratio: number;
  context: string; // 'normal-text' | 'large-text' | 'ui-element'
}

export interface ColorBlindnessReport {
  protanopia: ColorBlindnessTest;
  deuteranopia: ColorBlindnessTest;
  tritanopia: ColorBlindnessTest;
}

export interface ColorBlindnessTest {
  distinguishable: boolean;
  issues: string[];
  severity: "none" | "minor" | "major" | "severe";
}

export interface AccessibilityScore {
  total: number;
  contrast: number;
  colorBlindness: number;
  usability: number;
  breakdown: {
    wcagAA: number;
    wcagAAA: number;
    protanopia: number;
    deuteranopia: number;
    tritanopia: number;
    generalUsability: number;
  };
}

export interface AccessibilityImprovement {
  type: "contrast" | "color-blindness" | "usability" | "wcag";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  currentIssue: string;
  suggestedFix: string;
  impact: string;
  colors?: string[];
}

/**
 * Comprehensive accessibility analysis of color system
 * @param colorSystem - The color system to analyze
 * @returns Complete accessibility report
 */
export function analyzeColorAccessibility(
  colorSystem: ColorSystem
): AccessibilityReport {
  try {
    // Generate all important color pairs for testing
    const colorPairs = generateColorPairs(colorSystem);

    // Test WCAG compliance
    const wcagAA = testWCAGCompliance(colorPairs, "AA");
    const wcagAAA = testWCAGCompliance(colorPairs, "AAA");

    // Test color blindness compatibility
    const colorBlindness = checkColorBlindnessCompatibility(
      Object.values(colorSystem)
    );

    // Calculate overall score
    const score = calculateAccessibilityScore(colorSystem);

    // Generate improvement suggestions
    const improvements = suggestAccessibilityImprovements(colorSystem);

    // Determine overall rating
    const overall = determineOverallRating(score.total);

    return {
      overall,
      score: score.total,
      wcagAA,
      wcagAAA,
      colorBlindness,
      improvements,
    };
  } catch (error) {
    console.warn("Error analyzing color accessibility:", error);
    return getFailsafeAccessibilityReport();
  }
}

/**
 * Check for color blindness compatibility
 * @param colors - Array of colors to test
 * @returns Color blindness compatibility report
 */
export function checkColorBlindnessCompatibility(
  colors: string[]
): ColorBlindnessReport {
  try {
    // Filter out invalid colors
    const validColors = colors.filter((color) => {
      try {
        if (!color || typeof color !== "string") return false;
        chroma(color); // Test if color is valid
        return true;
      } catch {
        console.warn("Skipping invalid color in color blindness check:", color);
        return false;
      }
    });

    if (validColors.length === 0) {
      console.warn("No valid colors provided for color blindness check");
      throw new Error("No valid colors to analyze");
    }

    return {
      protanopia: testColorBlindnessType(validColors, "protanopia"),
      deuteranopia: testColorBlindnessType(validColors, "deuteranopia"),
      tritanopia: testColorBlindnessType(validColors, "tritanopia"),
    };
  } catch (error) {
    console.warn("Error checking color blindness compatibility:", error);
    return {
      protanopia: {
        distinguishable: false,
        issues: ["Analysis failed"],
        severity: "severe",
      },
      deuteranopia: {
        distinguishable: false,
        issues: ["Analysis failed"],
        severity: "severe",
      },
      tritanopia: {
        distinguishable: false,
        issues: ["Analysis failed"],
        severity: "severe",
      },
    };
  }
}

/**
 * Generate accessibility score for entire color system
 * @param colorSystem - Color system to score
 * @returns Detailed accessibility scoring breakdown
 */
export function calculateAccessibilityScore(
  colorSystem: ColorSystem
): AccessibilityScore {
  try {
    const colorPairs = generateColorPairs(colorSystem);

    // Calculate WCAG scores
    const wcagAA = calculateWCAGScore(colorPairs, "AA");
    const wcagAAA = calculateWCAGScore(colorPairs, "AAA");

    // Calculate color blindness scores
    const colors = Object.values(colorSystem);
    const protanopia = calculateColorBlindnessScore(colors, "protanopia");
    const deuteranopia = calculateColorBlindnessScore(colors, "deuteranopia");
    const tritanopia = calculateColorBlindnessScore(colors, "tritanopia");

    // Calculate general usability score
    const generalUsability = calculateUsabilityScore(colorSystem);

    // Calculate weighted totals
    const contrastScore = wcagAA * 0.7 + wcagAAA * 0.3;
    const colorBlindnessScore = (protanopia + deuteranopia + tritanopia) / 3;
    const usabilityScore = generalUsability;

    const totalScore =
      contrastScore * 0.5 + colorBlindnessScore * 0.3 + usabilityScore * 0.2;

    return {
      total: Math.round(totalScore),
      contrast: Math.round(contrastScore),
      colorBlindness: Math.round(colorBlindnessScore),
      usability: Math.round(usabilityScore),
      breakdown: {
        wcagAA: Math.round(wcagAA),
        wcagAAA: Math.round(wcagAAA),
        protanopia: Math.round(protanopia),
        deuteranopia: Math.round(deuteranopia),
        tritanopia: Math.round(tritanopia),
        generalUsability: Math.round(generalUsability),
      },
    };
  } catch (error) {
    console.warn("Error calculating accessibility score:", error);
    return {
      total: 0,
      contrast: 0,
      colorBlindness: 0,
      usability: 0,
      breakdown: {
        wcagAA: 0,
        wcagAAA: 0,
        protanopia: 0,
        deuteranopia: 0,
        tritanopia: 0,
        generalUsability: 0,
      },
    };
  }
}

/**
 * Suggest color adjustments for better accessibility
 * @param colorSystem - Current color system
 * @returns Array of accessibility improvement suggestions
 */
export function suggestAccessibilityImprovements(
  colorSystem: ColorSystem
): AccessibilityImprovement[] {
  const improvements: AccessibilityImprovement[] = [];

  try {
    // Check text/background contrast
    const textBgContrast = calculateContrast(
      colorSystem.text,
      colorSystem.background
    );
    if (textBgContrast < 4.5) {
      improvements.push({
        type: "contrast",
        priority: textBgContrast < 3 ? "critical" : "high",
        title: "Improve text contrast",
        description: "Text and background colors do not meet WCAG AA standards",
        currentIssue: `Current contrast ratio: ${textBgContrast.toFixed(1)}:1`,
        suggestedFix: "Increase color difference between text and background",
        impact: "Critical for users with visual impairments and low vision",
        colors: [colorSystem.text, colorSystem.background],
      });
    }

    // Check primary/background contrast
    const primaryBgContrast = calculateContrast(
      colorSystem.primary,
      colorSystem.background
    );
    if (primaryBgContrast < 3) {
      improvements.push({
        type: "contrast",
        priority: "high",
        title: "Improve primary color visibility",
        description: "Primary color has insufficient contrast with background",
        currentIssue: `Current contrast ratio: ${primaryBgContrast.toFixed(
          1
        )}:1`,
        suggestedFix: "Adjust primary color saturation or lightness",
        impact: "Important UI elements may be hard to see",
        colors: [colorSystem.primary, colorSystem.background],
      });
    }

    // Check color blindness issues
    const colorBlindness = checkColorBlindnessCompatibility(
      Object.values(colorSystem)
    );

    ["protanopia", "deuteranopia", "tritanopia"].forEach((type) => {
      const test = colorBlindness[type as keyof ColorBlindnessReport];
      if (test.severity === "major" || test.severity === "severe") {
        improvements.push({
          type: "color-blindness",
          priority: test.severity === "severe" ? "high" : "medium",
          title: `Improve ${type} compatibility`,
          description: `Colors may be difficult to distinguish for users with ${type}`,
          currentIssue: test.issues.join(", "),
          suggestedFix:
            "Use patterns, textures, or alternative visual cues beyond color",
          impact: `Affects approximately ${getColorBlindnessPrevalence(
            type
          )}% of users`,
        });
      }
    });

    // Check for sufficient color variety
    const colors = [
      colorSystem.primary,
      colorSystem.secondary,
      colorSystem.accent,
    ];
    const distinctColors = countDistinctColors(colors);
    if (distinctColors < colors.length) {
      improvements.push({
        type: "usability",
        priority: "medium",
        title: "Increase color distinctiveness",
        description: "Some colors in the palette are too similar",
        currentIssue: "Colors may be confused for one another",
        suggestedFix: "Choose colors with greater visual separation",
        impact: "Helps users distinguish between different UI elements",
      });
    }

    // Sort by priority
    return improvements.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  } catch (error) {
    console.warn("Error generating accessibility improvements:", error);
    return [];
  }
}

// Helper functions

function generateColorPairs(colorSystem: ColorSystem): ColorPair[] {
  const pairs: ColorPair[] = [];

  // Essential text/background pairs
  pairs.push({
    foreground: colorSystem.text,
    background: colorSystem.background,
    ratio: calculateContrast(colorSystem.text, colorSystem.background),
    context: "normal-text",
  });

  // UI element pairs
  pairs.push({
    foreground: colorSystem.primary,
    background: colorSystem.background,
    ratio: calculateContrast(colorSystem.primary, colorSystem.background),
    context: "ui-element",
  });

  pairs.push({
    foreground: colorSystem.secondary,
    background: colorSystem.background,
    ratio: calculateContrast(colorSystem.secondary, colorSystem.background),
    context: "ui-element",
  });

  pairs.push({
    foreground: colorSystem.accent,
    background: colorSystem.background,
    ratio: calculateContrast(colorSystem.accent, colorSystem.background),
    context: "ui-element",
  });

  // White text on colored backgrounds (common for buttons)
  pairs.push({
    foreground: "#ffffff",
    background: colorSystem.primary,
    ratio: calculateContrast("#ffffff", colorSystem.primary),
    context: "large-text",
  });

  return pairs;
}

function testWCAGCompliance(
  colorPairs: ColorPair[],
  level: "AA" | "AAA"
): ComplianceReport {
  const passes: ColorPair[] = [];
  const fails: ColorPair[] = [];
  const warnings: ColorPair[] = [];

  colorPairs.forEach((pair) => {
    const isLargeText = pair.context === "large-text";
    const compliance =
      level === "AA"
        ? checkAACompliance(pair.foreground, pair.background, isLargeText)
        : checkAAACompliance(pair.foreground, pair.background, isLargeText);

    if (compliance) {
      passes.push(pair);
    } else {
      // Determine if it's a complete fail or just warning
      const basicCompliance = checkAACompliance(
        pair.foreground,
        pair.background,
        isLargeText
      );
      if (basicCompliance && level === "AAA") {
        warnings.push(pair);
      } else {
        fails.push(pair);
      }
    }
  });

  return { passes, fails, warnings };
}

function testColorBlindnessType(
  colors: string[],
  type: "protanopia" | "deuteranopia" | "tritanopia"
): ColorBlindnessTest {
  const issues: string[] = [];
  let distinguishable = true;

  try {
    // Simulate color blindness by converting colors and checking distinguishability
    const simulatedColors = colors.map((color) =>
      simulateColorBlindness(color, type)
    );

    // Check for color pairs that become too similar
    for (let i = 0; i < simulatedColors.length - 1; i++) {
      for (let j = i + 1; j < simulatedColors.length; j++) {
        try {
          // Validate colors before calculating deltaE
          if (!simulatedColors[i] || !simulatedColors[j]) {
            continue;
          }

          const deltaE = chroma.deltaE(simulatedColors[i], simulatedColors[j]);

          if (deltaE < 10) {
            // Colors are too similar
            issues.push(
              `Colors ${i + 1} and ${j + 1} become indistinguishable`
            );
            distinguishable = false;
          }
        } catch (error) {
          // Skip invalid color pairs but log for debugging
          console.warn(
            `Failed to calculate deltaE for colors ${simulatedColors[i]}, ${simulatedColors[j]}:`,
            error
          );
          continue;
        }
      }
    }

    // Determine severity
    let severity: ColorBlindnessTest["severity"];
    if (issues.length === 0) {
      severity = "none";
    } else if (issues.length <= 1) {
      severity = "minor";
    } else if (issues.length <= 3) {
      severity = "major";
    } else {
      severity = "severe";
    }

    return { distinguishable, issues, severity };
  } catch (error) {
    console.warn(`Error testing ${type}:`, error);
    return {
      distinguishable: false,
      issues: ["Analysis failed"],
      severity: "severe",
    };
  }
}

function simulateColorBlindness(
  color: string,
  type: "protanopia" | "deuteranopia" | "tritanopia"
): string {
  try {
    // Validate input color
    if (!color || typeof color !== "string" || color.trim() === "") {
      console.warn(`Invalid color input for ${type} simulation:`, color);
      return color || "#000000";
    }

    const [r, g, b] = chroma(color).rgb();

    // Simplified color blindness simulation matrices
    let newR: number, newG: number, newB: number;

    switch (type) {
      case "protanopia": // Red blindness
        newR = 0.567 * r + 0.433 * g;
        newG = 0.558 * r + 0.442 * g;
        newB = 0.242 * g + 0.758 * b;
        break;
      case "deuteranopia": // Green blindness
        newR = 0.625 * r + 0.375 * g;
        newG = 0.7 * r + 0.3 * g;
        newB = 0.3 * g + 0.7 * b;
        break;
      case "tritanopia": // Blue blindness
        newR = 0.95 * r + 0.05 * g;
        newG = 0.433 * g + 0.567 * b;
        newB = 0.475 * g + 0.525 * b;
        break;
      default:
        return color;
    }

    return chroma
      .rgb(
        Math.max(0, Math.min(255, newR)),
        Math.max(0, Math.min(255, newG)),
        Math.max(0, Math.min(255, newB))
      )
      .hex();
  } catch (error) {
    console.warn(`Error simulating ${type} for color ${color}:`, error);
    return color;
  }
}

function calculateWCAGScore(
  colorPairs: ColorPair[],
  level: "AA" | "AAA"
): number {
  if (colorPairs.length === 0) return 0;

  const compliance = testWCAGCompliance(colorPairs, level);
  const passedCount = compliance.passes.length;
  const totalCount = colorPairs.length;

  return (passedCount / totalCount) * 100;
}

function calculateColorBlindnessScore(
  colors: string[],
  type: "protanopia" | "deuteranopia" | "tritanopia"
): number {
  const test = testColorBlindnessType(colors, type);

  switch (test.severity) {
    case "none":
      return 100;
    case "minor":
      return 80;
    case "major":
      return 50;
    case "severe":
      return 20;
    default:
      return 0;
  }
}

function calculateUsabilityScore(colorSystem: ColorSystem): number {
  const validation = validateColorSystem(colorSystem);
  return validation.score;
}

function countDistinctColors(colors: string[]): number {
  const distinctColors = new Set();

  colors.forEach((color) => {
    try {
      // Normalize to hex and add to set
      distinctColors.add(chroma(color).hex().toLowerCase());
    } catch (error) {
      // Skip invalid colors
    }
  });

  return distinctColors.size;
}

function getColorBlindnessPrevalence(type: string): number {
  switch (type) {
    case "protanopia":
      return 1;
    case "deuteranopia":
      return 6;
    case "tritanopia":
      return 0.1;
    default:
      return 0;
  }
}

function determineOverallRating(score: number): AccessibilityReport["overall"] {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "fair";
  return "poor";
}

function getFailsafeAccessibilityReport(): AccessibilityReport {
  return {
    overall: "poor",
    score: 0,
    wcagAA: { passes: [], fails: [], warnings: [] },
    wcagAAA: { passes: [], fails: [], warnings: [] },
    colorBlindness: {
      protanopia: {
        distinguishable: false,
        issues: ["Analysis failed"],
        severity: "severe",
      },
      deuteranopia: {
        distinguishable: false,
        issues: ["Analysis failed"],
        severity: "severe",
      },
      tritanopia: {
        distinguishable: false,
        issues: ["Analysis failed"],
        severity: "severe",
      },
    },
    improvements: [
      {
        type: "wcag",
        priority: "critical",
        title: "System analysis failed",
        description: "Unable to analyze color system accessibility",
        currentIssue: "Analysis error occurred",
        suggestedFix: "Check color format validity and try again",
        impact: "Cannot ensure accessibility compliance",
      },
    ],
  };
}
