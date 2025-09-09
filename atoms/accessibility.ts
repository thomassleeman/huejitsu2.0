// Accessibility state atoms using Jotai
// Real-time accessibility analysis derived from color system

import { atom } from "jotai";
import {
  analyzeColorAccessibility,
  calculateAccessibilityScore,
  checkColorBlindnessCompatibility,
  suggestAccessibilityImprovements,
  type AccessibilityReport,
  type AccessibilityScore,
  type ColorBlindnessReport,
  type AccessibilityImprovement,
  type ComplianceReport,
  type ColorPair,
} from "@/lib/color/accessibility-checker";
import { calculateContrast } from "@/lib/color/contrast-calculator";
import { colorsAtom } from "@/atoms/design-system";
import type { ColorSystem } from "@/types/design-system";

// Main accessibility report atom - updates whenever colors change
export const accessibilityReportAtom = atom<AccessibilityReport>((get) => {
  const colors = get(colorsAtom);
  return analyzeColorAccessibility(colors);
});

// Accessibility score breakdown atom
export const accessibilityScoreAtom = atom<AccessibilityScore>((get) => {
  const colors = get(colorsAtom);
  return calculateAccessibilityScore(colors);
});

// Color blindness compatibility atom
export const colorBlindnessReportAtom = atom<ColorBlindnessReport>((get) => {
  const colors = get(colorsAtom);
  return checkColorBlindnessCompatibility(Object.values(colors));
});

// Improvement suggestions atom
export const accessibilityImprovementsAtom = atom<AccessibilityImprovement[]>(
  (get) => {
    const colors = get(colorsAtom);
    return suggestAccessibilityImprovements(colors);
  }
);

// Contrast ratios for all important color pairs
export const allContrastRatiosAtom = atom<ColorPair[]>((get) => {
  const colors = get(colorsAtom);

  const pairs: ColorPair[] = [];

  // Essential text/background pair
  pairs.push({
    foreground: colors.text,
    background: colors.background,
    ratio: calculateContrast(colors.text, colors.background),
    context: "normal-text",
  });

  // UI element pairs against background
  pairs.push({
    foreground: colors.primary,
    background: colors.background,
    ratio: calculateContrast(colors.primary, colors.background),
    context: "ui-element",
  });

  pairs.push({
    foreground: colors.secondary,
    background: colors.background,
    ratio: calculateContrast(colors.secondary, colors.background),
    context: "ui-element",
  });

  pairs.push({
    foreground: colors.accent,
    background: colors.background,
    ratio: calculateContrast(colors.accent, colors.background),
    context: "ui-element",
  });

  // White text on colored backgrounds (button text)
  pairs.push({
    foreground: "#ffffff",
    background: colors.primary,
    ratio: calculateContrast("#ffffff", colors.primary),
    context: "large-text",
  });

  pairs.push({
    foreground: "#ffffff",
    background: colors.secondary,
    ratio: calculateContrast("#ffffff", colors.secondary),
    context: "large-text",
  });

  pairs.push({
    foreground: "#ffffff",
    background: colors.accent,
    ratio: calculateContrast("#ffffff", colors.accent),
    context: "large-text",
  });

  return pairs;
});

// WCAG AA compliance atom
export const wcagAAComplianceAtom = atom<ComplianceReport>((get) => {
  const report = get(accessibilityReportAtom);
  return report.wcagAA;
});

// WCAG AAA compliance atom
export const wcagAAAComplianceAtom = atom<ComplianceReport>((get) => {
  const report = get(accessibilityReportAtom);
  return report.wcagAAA;
});

// Critical issues atom - filters high priority accessibility problems
export const criticalAccessibilityIssuesAtom = atom<AccessibilityImprovement[]>(
  (get) => {
    const improvements = get(accessibilityImprovementsAtom);
    return improvements.filter(
      (issue) => issue.priority === "critical" || issue.priority === "high"
    );
  }
);

// Overall accessibility status atom
export const accessibilityStatusAtom = atom<{
  overall: AccessibilityReport["overall"];
  score: number;
  hasIssues: boolean;
  criticalCount: number;
}>((get) => {
  const report = get(accessibilityReportAtom);
  const criticalIssues = get(criticalAccessibilityIssuesAtom);

  return {
    overall: report.overall,
    score: report.score,
    hasIssues: report.improvements.length > 0,
    criticalCount: criticalIssues.length,
  };
});

// Warning badges atom - determines which color controls should show warnings
export const colorWarningsAtom = atom<Record<keyof ColorSystem, boolean>>(
  (get) => {
    const improvements = get(accessibilityImprovementsAtom);

    const warnings: Record<keyof ColorSystem, boolean> = {
      primary: false,
      secondary: false,
      accent: false,
      background: false,
      text: false,
      palette: false,
    };

    improvements.forEach((improvement) => {
      if (improvement.colors) {
        const colors = get(colorsAtom);
        improvement.colors.forEach((color) => {
          // Check which color property matches this hex value
          Object.entries(colors).forEach(([key, value]) => {
            if (value === color && key in warnings) {
              warnings[key as keyof ColorSystem] = true;
            }
          });
        });
      }
    });

    return warnings;
  }
);
