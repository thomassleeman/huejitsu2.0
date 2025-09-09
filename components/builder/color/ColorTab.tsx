"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import {
  colorsAtom,
  pinningStateAtom,
  colorSchemeAtom,
} from "@/atoms/design-system";
import { generateColorVariation } from "@/lib/color/generateColorVariation";
import type { ColorSchemeType } from "@/lib/color/harmony-algorithms";
import { useCreativeIteration } from "@/hooks/useCreativeIteration";
import { useHarmonyCompatibility } from "@/hooks/useHarmonyCompatibility";
import {
  getOptimalTextColor,
  calculateContrast,
} from "@/lib/color/contrast-calculator";
import { KeyboardInstructions } from "@/components/ui/KeyboardInstructions";
import { PinButton } from "@/components/ui/PinButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";
import { AccessibilityWarningBadge } from "@/components/accessibility/AccessibilityWarningBadge";
import { HarmonyTooltip } from "@/components/ui/EducationalTooltip";

const COLOR_SCHEMES = [
  { value: "monochromatic", label: "Monochromatic" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic" },
  { value: "tetradic", label: "Tetradic" },
  { value: "split-complementary", label: "Split Complementary" },
] as const;

export function ColorTab() {
  const [colors, setColors] = useAtom(colorsAtom);
  const [pinning, setPinning] = useAtom(pinningStateAtom);
  const [selectedScheme, setSelectedScheme] = useAtom(colorSchemeAtom);

  // Get harmony compatibility state
  const harmonyCompatibility = useHarmonyCompatibility();

  // Generation function that respects pinning and compatibility
  const generateVariation = useCallback(() => {
    // If random is selected and there are compatibility constraints, pick from compatible options
    let effectiveScheme = selectedScheme;
    if (
      selectedScheme === "random" &&
      harmonyCompatibility.compatibleHarmonies.length > 0
    ) {
      const compatibleOptions = harmonyCompatibility.compatibleHarmonies;
      effectiveScheme =
        compatibleOptions[Math.floor(Math.random() * compatibleOptions.length)];
    }

    return generateColorVariation(colors, {
      pinnedPrimary: pinning.colors.primary,
      pinnedSecondary: pinning.colors.secondary,
      pinnedAccent: pinning.colors.accent,
      pinnedBackground: pinning.colors.background,
      pinnedText: pinning.colors.text,
      colorScheme: effectiveScheme === "random" ? undefined : effectiveScheme,
    });
  }, [
    colors,
    pinning.colors,
    selectedScheme,
    harmonyCompatibility.compatibleHarmonies,
  ]);

  // Creative iteration hook
  const iteration = useCreativeIteration({
    initialData: colors,
    generateFunction: generateVariation,
    onDataChange: setColors,
  });

  // Toggle pinning functions
  const togglePin = (colorKey: keyof typeof pinning.colors) => {
    setPinning((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: !prev.colors[colorKey],
      },
    }));
  };

  // Manual color change handlers with contrast checking
  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    setColors((prev) => {
      const updatedColors = { ...prev, [colorKey]: value };

      // Only auto-adjust unpinned colors for contrast compliance
      if (colorKey === "background" && !pinning.colors.text) {
        // Auto-adjust text color when background changes (if text is not pinned)
        updatedColors.text = getOptimalTextColor(value);
      }

      if (colorKey === "text" && !pinning.colors.background) {
        // If text is manually changed but background isn't pinned,
        // ensure background provides good contrast
        const contrast = calculateContrast(value, prev.background);
        if (contrast < 4.5) {
          // Adjust background to ensure proper contrast
          // Choose the background that provides better contrast with the new text color
          const contrastWithWhite = calculateContrast(value, "#ffffff");
          const contrastWithBlack = calculateContrast(value, "#000000");
          updatedColors.background =
            contrastWithWhite > contrastWithBlack ? "#ffffff" : "#000000";
        }
      }

      return updatedColors;
    });
  };

  // Get scheme description helper
  const getSchemeDescription = (scheme: ColorSchemeType | "random"): string => {
    if (scheme === "random")
      return "Randomly selects a harmony type for variety";

    const descriptions: Record<ColorSchemeType, string> = {
      monochromatic: "Variations of a single hue - harmonious and calming",
      analogous: "Adjacent colors on the wheel - naturally pleasing",
      complementary: "Opposite colors - high contrast and vibrant",
      triadic: "Three evenly spaced colors - balanced and lively",
      tetradic: "Four colors in rectangle formation - rich and diverse",
      "split-complementary":
        "Base color + two adjacent to complement - softer contrast",
    };
    return descriptions[scheme] || "";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with iteration info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Color System</h2>
          {iteration.history.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Scheme {iteration.currentIndex + 1} of {iteration.history.length}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={iteration.generateNew} variant="outline" size="sm">
            Generate New Scheme
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Primary Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <PinButton
                    isPinned={pinning.colors.primary}
                    onToggle={() => togglePin("primary")}
                    size="sm"
                  />
                  <AccessibilityWarningBadge colorKey="primary" />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={colors.primary}
                    onChange={(e) =>
                      handleColorChange("primary", e.target.value)
                    }
                    className="w-16 h-10 p-1 border rounded"
                    disabled={pinning.colors.primary}
                  />
                  <Input
                    type="text"
                    value={colors.primary}
                    onChange={(e) =>
                      handleColorChange("primary", e.target.value)
                    }
                    className="flex-1"
                    disabled={pinning.colors.primary}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <PinButton
                    isPinned={pinning.colors.secondary}
                    onToggle={() => togglePin("secondary")}
                    size="sm"
                  />
                  <AccessibilityWarningBadge colorKey="secondary" />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={colors.secondary}
                    onChange={(e) =>
                      handleColorChange("secondary", e.target.value)
                    }
                    className="w-16 h-10 p-1 border rounded"
                    disabled={pinning.colors.secondary}
                  />
                  <Input
                    type="text"
                    value={colors.secondary}
                    onChange={(e) =>
                      handleColorChange("secondary", e.target.value)
                    }
                    className="flex-1"
                    disabled={pinning.colors.secondary}
                    placeholder="#10B981"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <PinButton
                    isPinned={pinning.colors.accent}
                    onToggle={() => togglePin("accent")}
                    size="sm"
                  />
                  <AccessibilityWarningBadge colorKey="accent" />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={colors.accent}
                    onChange={(e) =>
                      handleColorChange("accent", e.target.value)
                    }
                    className="w-16 h-10 p-1 border rounded"
                    disabled={pinning.colors.accent}
                  />
                  <Input
                    type="text"
                    value={colors.accent}
                    onChange={(e) =>
                      handleColorChange("accent", e.target.value)
                    }
                    className="flex-1"
                    disabled={pinning.colors.accent}
                    placeholder="#F59E0B"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Harmony Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="colorScheme">Harmony Algorithm</Label>
                <Select
                  value={selectedScheme}
                  onValueChange={(value: ColorSchemeType | "random") =>
                    setSelectedScheme(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select harmony type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">
                      🎲 Random (Surprise Me!)
                    </SelectItem>
                    {harmonyCompatibility.harmonyOptions.map(
                      (harmonyOption) => {
                        const scheme = COLOR_SCHEMES.find(
                          (s) => s.value === harmonyOption.type
                        );
                        if (!scheme) return null;

                        return (
                          <HarmonyTooltip
                            key={harmonyOption.type}
                            harmonyType={harmonyOption.label}
                            isCompatible={harmonyOption.isCompatible}
                            tooltip={harmonyOption.tooltip}
                            incompatibilityReason={
                              harmonyOption.incompatibilityReason
                            }
                          >
                            <SelectItem
                              value={harmonyOption.type}
                              disabled={!harmonyOption.isCompatible}
                              className={
                                !harmonyOption.isCompatible
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                            >
                              <span
                                className={
                                  !harmonyOption.isCompatible
                                    ? "text-muted-foreground"
                                    : ""
                                }
                              >
                                {harmonyOption.label}
                                {!harmonyOption.isCompatible && " 🚫"}
                              </span>
                            </SelectItem>
                          </HarmonyTooltip>
                        );
                      }
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {getSchemeDescription(selectedScheme)}
                </p>
                {harmonyCompatibility.pinnedColorCount > 0 && (
                  <div className="mt-2 p-2 bg-muted rounded-md text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        📌 {harmonyCompatibility.pinnedColorCount} color
                        {harmonyCompatibility.pinnedColorCount > 1 ? "s" : ""}{" "}
                        pinned
                      </span>
                      {harmonyCompatibility.hasIncompatibleOptions && (
                        <span className="text-muted-foreground">
                          • Some harmonies disabled
                        </span>
                      )}
                    </div>
                    {harmonyCompatibility.hasIncompatibleOptions && (
                      <p className="text-muted-foreground mt-1">
                        Hover over disabled options to learn about color theory
                        relationships
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Background & Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <PinButton
                    isPinned={pinning.colors.background}
                    onToggle={() => togglePin("background")}
                    size="sm"
                  />
                  <AccessibilityWarningBadge colorKey="background" />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={colors.background}
                    onChange={(e) =>
                      handleColorChange("background", e.target.value)
                    }
                    className="w-16 h-10 p-1 border rounded"
                    disabled={pinning.colors.background}
                  />
                  <Input
                    type="text"
                    value={colors.background}
                    onChange={(e) =>
                      handleColorChange("background", e.target.value)
                    }
                    className="flex-1"
                    disabled={pinning.colors.background}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <PinButton
                    isPinned={pinning.colors.text}
                    onToggle={() => togglePin("text")}
                    size="sm"
                  />
                  <AccessibilityWarningBadge colorKey="text" />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={colors.text}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                    disabled={pinning.colors.text}
                  />
                  <Input
                    type="text"
                    value={colors.text}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                    className="flex-1"
                    disabled={pinning.colors.text}
                    placeholder="#111827"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Accessibility Section */}
        <div className="space-y-6">
          {/* Color Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Color Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div
                    className="w-full h-24 rounded-lg border mb-2"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground">
                    {colors.primary}
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className="w-full h-24 rounded-lg border mb-2"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <p className="text-sm font-medium">Secondary</p>
                  <p className="text-xs text-muted-foreground">
                    {colors.secondary}
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className="w-full h-24 rounded-lg border mb-2"
                    style={{ backgroundColor: colors.accent }}
                  />
                  <p className="text-sm font-medium">Accent</p>
                  <p className="text-xs text-muted-foreground">
                    {colors.accent}
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className="w-full h-24 rounded-lg border mb-2"
                    style={{ backgroundColor: colors.background }}
                  />
                  <p className="text-sm font-medium">Background</p>
                  <p className="text-xs text-muted-foreground">
                    {colors.background}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Preview */}
          <Card>
            <CardContent>
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.primary + "20",
                }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.primary }}
                >
                  Example Card
                </h3>
                <p className="mb-4">
                  This is how your colors work together in a real interface. The
                  primary color is used for headings and key elements.
                </p>
                <div className="flex gap-2">
                  <Button
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                      border: "none",
                    }}
                  >
                    Primary Action
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      borderColor: colors.secondary,
                      color: colors.secondary,
                    }}
                  >
                    Secondary Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Analysis */}
          <AccessibilityPanel variant="compact" />
        </div>
      </div>

      {/* Keyboard Instructions */}
      <KeyboardInstructions
        generateAction="generate new color schemes"
        navigateAction="navigate color history"
      />
    </div>
  );
}
