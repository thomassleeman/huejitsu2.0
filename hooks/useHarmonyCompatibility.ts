import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { colorsAtom, pinningStateAtom } from "@/atoms/design-system";
import {
  analyzeColorRelationships,
  isHarmonyCompatible,
  getCompatibleHarmonies,
  generateHarmonyTooltip,
  generateIncompatibilityReason,
  type ColorRelationshipAnalysis,
  type HarmonyCompatibilityResult,
} from "@/lib/color/harmony-analysis";
import type { ColorSchemeType } from "@/lib/color/harmony-algorithms";

/**
 * Individual harmony compatibility state
 */
export interface HarmonyOption {
  type: ColorSchemeType;
  label: string;
  isCompatible: boolean;
  tooltip: string;
  incompatibilityReason?: string;
}

/**
 * Complete harmony compatibility state
 */
export interface HarmonyCompatibilityState {
  analysis: ColorRelationshipAnalysis;
  compatibleHarmonies: ColorSchemeType[];
  harmonyOptions: HarmonyOption[];
  hasIncompatibleOptions: boolean;
  pinnedColorCount: number;
}

/**
 * Custom hook that analyzes pinned colors and provides harmony compatibility state
 */
export function useHarmonyCompatibility(): HarmonyCompatibilityState {
  const colors = useAtomValue(colorsAtom);
  const pinningState = useAtomValue(pinningStateAtom);

  const harmonyCompatibilityState = useMemo(() => {
    // Analyze current color relationships
    const analysis = analyzeColorRelationships(colors, pinningState);

    // Get compatible harmonies
    const compatibleHarmonies = getCompatibleHarmonies(analysis);

    // Define all harmony options with labels
    const allHarmonyOptions: Array<{
      type: ColorSchemeType;
      label: string;
    }> = [
      { type: "monochromatic", label: "Monochromatic" },
      { type: "analogous", label: "Analogous" },
      { type: "complementary", label: "Complementary" },
      { type: "triadic", label: "Triadic" },
      { type: "tetradic", label: "Tetradic" },
      { type: "split-complementary", label: "Split Complementary" },
    ];

    // Build harmony options with compatibility info
    const harmonyOptions: HarmonyOption[] = allHarmonyOptions.map((option) => {
      const compatibilityResult = isHarmonyCompatible(option.type, analysis);
      const tooltip = generateHarmonyTooltip(option.type, analysis);

      return {
        type: option.type,
        label: option.label,
        isCompatible: compatibilityResult.isCompatible,
        tooltip,
        incompatibilityReason: compatibilityResult.isCompatible
          ? undefined
          : generateIncompatibilityReason(option.type, analysis),
      };
    });

    const hasIncompatibleOptions = harmonyOptions.some(
      (option) => !option.isCompatible
    );
    const pinnedColorCount = analysis.pinnedColors.length;

    return {
      analysis,
      compatibleHarmonies,
      harmonyOptions,
      hasIncompatibleOptions,
      pinnedColorCount,
    };
  }, [colors, pinningState]);

  return harmonyCompatibilityState;
}

/**
 * Helper hook that returns only compatible harmony options for dropdowns
 */
export function useCompatibleHarmonies(): ColorSchemeType[] {
  const { compatibleHarmonies } = useHarmonyCompatibility();
  return compatibleHarmonies;
}

/**
 * Helper hook that checks if a specific harmony type is compatible
 */
export function useIsHarmonyCompatible(harmonyType: ColorSchemeType): boolean {
  const { harmonyOptions } = useHarmonyCompatibility();
  const option = harmonyOptions.find((opt) => opt.type === harmonyType);
  return option?.isCompatible ?? true;
}
