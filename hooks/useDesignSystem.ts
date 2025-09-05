// Design system CRUD operations hook
// Following the state management architecture from state.md

import { useAtom, useAtomValue } from "jotai";
import {
  colorsAtom,
  typographyAtom,
  spacingAtom,
  componentsAtom,
  iconsAtom,
  exportDataAtom,
} from "@/atoms/design-system";
import type { DesignTokens } from "@/types/design-system";

export function useDesignSystem() {
  const [colors, setColors] = useAtom(colorsAtom);
  const [typography, setTypography] = useAtom(typographyAtom);
  const [spacing, setSpacing] = useAtom(spacingAtom);
  const [components, setComponents] = useAtom(componentsAtom);
  const [icons, setIcons] = useAtom(iconsAtom);

  const exportData = useAtomValue(exportDataAtom);

  const designTokens: DesignTokens = {
    colors,
    typography,
    spacing,
    components,
    icons,
  };

  const updateColors = (newColors: Partial<typeof colors>) => {
    setColors((prev) => ({ ...prev, ...newColors }));
  };

  const updateTypography = (newTypography: Partial<typeof typography>) => {
    setTypography((prev) => ({ ...prev, ...newTypography }));
  };

  const updateSpacing = (newSpacing: Partial<typeof spacing>) => {
    setSpacing((prev) => ({ ...prev, ...newSpacing }));
  };

  const updateComponents = (newComponents: Partial<typeof components>) => {
    setComponents((prev) => ({ ...prev, ...newComponents }));
  };

  const updateIcons = (newIcons: Partial<typeof icons>) => {
    setIcons((prev) => ({ ...prev, ...newIcons }));
  };

  const loadDesignSystem = (tokens: DesignTokens) => {
    setColors(tokens.colors);
    setTypography(tokens.typography);
    setSpacing(tokens.spacing);
    setComponents(tokens.components);
    setIcons(tokens.icons);
  };

  const resetToDefaults = () => {
    // TODO: Implement reset to default values
    console.log("Reset to defaults - to be implemented");
  };

  return {
    // Current state
    designTokens,
    colors,
    typography,
    spacing,
    components,
    icons,
    exportData,

    // Update functions
    updateColors,
    updateTypography,
    updateSpacing,
    updateComponents,
    updateIcons,

    // Utility functions
    loadDesignSystem,
    resetToDefaults,
  };
}
