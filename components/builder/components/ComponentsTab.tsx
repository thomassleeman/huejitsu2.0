"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import {
  componentsAtom,
  pinningStateAtom,
  colorsAtom,
} from "@/atoms/design-system";
import { generateComponentVariation } from "@/lib/components/generateComponentVariation";
import { useCreativeIteration } from "@/hooks/useCreativeIteration";
import { KeyboardInstructions } from "@/components/ui/KeyboardInstructions";
import { PinButton } from "@/components/ui/PinButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mix, isLight } from "@/lib/color/color-converter";

type ShadowStyleType =
  | "none"
  | "subtle"
  | "soft"
  | "bold"
  | "natural"
  | "crisp"
  | "playful"
  | "professional"
  | "digital"
  | "warm";
type ComponentStyleType =
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

const SHADOW_STYLES = [
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "soft", label: "Soft" },
  { value: "bold", label: "Bold" },
  { value: "natural", label: "Natural" },
  { value: "crisp", label: "Crisp" },
  { value: "playful", label: "Playful" },
  { value: "professional", label: "Professional" },
  { value: "digital", label: "Digital" },
  { value: "warm", label: "Warm" },
] as const;

const COMPONENT_STYLES = [
  { value: "minimal", label: "Minimal/Clean" },
  { value: "soft", label: "Soft/Rounded" },
  { value: "bold", label: "Bold/Geometric" },
  { value: "organic", label: "Organic/Natural" },
  { value: "modern", label: "Modern/Crisp" },
  { value: "classic", label: "Classic/Traditional" },
  { value: "playful", label: "Playful/Fun" },
  { value: "corporate", label: "Corporate/Professional" },
  { value: "tech", label: "Tech/Digital" },
  { value: "warm", label: "Warm/Friendly" },
] as const;

export function ComponentsTab() {
  const [components, setComponents] = useAtom(componentsAtom);
  const [pinning, setPinning] = useAtom(pinningStateAtom);
  const [colors] = useAtom(colorsAtom);

  // Generation function that respects pinning
  const generateVariation = useCallback(() => {
    return generateComponentVariation(components, {
      pinnedBorderRadius: pinning.components.borderRadius,
      pinnedBorderWidth: pinning.components.borderWidth,
      pinnedShadowStyle: pinning.components.shadowStyle,
      pinnedOpacity: pinning.components.opacityLevels,
    });
  }, [components, pinning.components]);

  // Creative iteration hook
  const iteration = useCreativeIteration({
    initialData: components,
    generateFunction: generateVariation,
    onDataChange: setComponents,
  });

  // Toggle pinning functions
  const togglePin = (property: keyof typeof pinning.components) => {
    setPinning((prev) => ({
      ...prev,
      components: {
        ...prev.components,
        [property]: !prev.components[property],
      },
    }));
  };

  // Manual change handlers
  const handleBorderRadiusChange = (value: number[]) => {
    setComponents((prev) => ({ ...prev, borderRadius: value[0] }));
  };

  const handleBorderWidthChange = (value: number[]) => {
    setComponents((prev) => ({ ...prev, borderWidth: value[0] }));
  };

  const handleShadowStyleChange = (value: string) => {
    setComponents((prev) => ({
      ...prev,
      shadowStyle: value as ShadowStyleType,
    }));
  };

  const handleOpacityChange = (index: number, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
      setComponents((prev) => ({
        ...prev,
        opacityLevels: prev.opacityLevels.map((level, i) =>
          i === index ? newValue : level
        ),
      }));
    }
  };

  const applyComponentStyle = (style: string) => {
    const variation = generateComponentVariation(undefined, {
      style: style as ComponentStyleType,
    });
    setComponents(variation);
  };

  // Shadow CSS based on style with dynamic colors
  const getShadowCSS = (style: string) => {
    if (style === "none") return "none";

    // Generate shadow color that complements the current color scheme
    const shadowBase = isLight(colors.background) ? "#000000" : colors.text;

    const shadows = {
      subtle: `0 1px 2px 0 ${mix(shadowBase, colors.background, 0.05)}`,
      soft: `0 4px 6px -1px ${mix(
        shadowBase,
        colors.background,
        0.1
      )}, 0 2px 4px -1px ${mix(shadowBase, colors.background, 0.06)}`,
      bold: `0 10px 15px -3px ${mix(
        shadowBase,
        colors.background,
        0.1
      )}, 0 4px 6px -2px ${mix(shadowBase, colors.background, 0.05)}`,
      natural: `0 8px 16px ${mix(shadowBase, colors.background, 0.15)}`,
      crisp: `0 2px 8px ${mix(shadowBase, colors.background, 0.12)}`,
      playful: `0 6px 20px ${mix(colors.accent, shadowBase, 0.15)}`,
      professional: `0 1px 3px ${mix(
        shadowBase,
        colors.background,
        0.12
      )}, 0 1px 2px ${mix(shadowBase, colors.background, 0.24)}`,
      digital: `0 0 10px ${mix(colors.primary, shadowBase, 0.3)}`,
      warm: `0 4px 12px ${mix(colors.secondary, shadowBase, 0.15)}`,
    };
    return shadows[style as keyof typeof shadows] || shadows.subtle;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with iteration info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Component System</h2>
          {iteration.history.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Style {iteration.currentIndex + 1} of {iteration.history.length}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Select onValueChange={applyComponentStyle}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Apply style preset" />
            </SelectTrigger>
            <SelectContent>
              {COMPONENT_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Border & Shape</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Label>Border Radius: {components.borderRadius}px</Label>
                  <PinButton
                    isPinned={pinning.components.borderRadius}
                    onToggle={() => togglePin("borderRadius")}
                    size="sm"
                  />
                </div>
                <Slider
                  value={[components.borderRadius]}
                  onValueChange={handleBorderRadiusChange}
                  min={0}
                  max={24}
                  step={1}
                  disabled={pinning.components.borderRadius}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Label>Border Width: {components.borderWidth}px</Label>
                  <PinButton
                    isPinned={pinning.components.borderWidth}
                    onToggle={() => togglePin("borderWidth")}
                    size="sm"
                  />
                </div>
                <Slider
                  value={[components.borderWidth]}
                  onValueChange={handleBorderWidthChange}
                  min={0}
                  max={4}
                  step={1}
                  disabled={pinning.components.borderWidth}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shadow Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Label htmlFor="shadowStyle">Shadow Style</Label>
                <PinButton
                  isPinned={pinning.components.shadowStyle}
                  onToggle={() => togglePin("shadowStyle")}
                  size="sm"
                />
              </div>
              <Select
                value={components.shadowStyle}
                onValueChange={handleShadowStyleChange}
                disabled={pinning.components.shadowStyle}
              >
                <SelectTrigger id="shadowStyle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHADOW_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opacity Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Label>Opacity Scale</Label>
                <PinButton
                  isPinned={pinning.components.opacityLevels}
                  onToggle={() => togglePin("opacityLevels")}
                  size="sm"
                />
              </div>
              <div className="space-y-2">
                {components.opacityLevels.map((level, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm w-8">{index + 1}:</span>
                    <Input
                      type="number"
                      value={level}
                      onChange={(e) =>
                        handleOpacityChange(index, e.target.value)
                      }
                      min="0"
                      max="1"
                      step="0.01"
                      className="flex-1"
                      disabled={pinning.components.opacityLevels}
                    />
                    <div
                      className="w-8 h-8 bg-primary rounded border"
                      style={{ opacity: level }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Button Examples */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Buttons
                </Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    style={{
                      borderRadius: `${components.borderRadius}px`,
                      borderWidth: `${components.borderWidth}px`,
                      boxShadow: getShadowCSS(components.shadowStyle),
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      borderRadius: `${components.borderRadius}px`,
                      borderWidth: `${components.borderWidth}px`,
                      boxShadow: getShadowCSS(components.shadowStyle),
                    }}
                  >
                    Outline Button
                  </Button>
                </div>
              </div>

              {/* Card Examples */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Cards</Label>
                <div
                  className="p-4 bg-background border"
                  style={{
                    borderRadius: `${components.borderRadius}px`,
                    borderWidth: `${components.borderWidth}px`,
                    boxShadow: getShadowCSS(components.shadowStyle),
                  }}
                >
                  <h4 className="font-semibold mb-2">Example Card</h4>
                  <p className="text-sm text-muted-foreground">
                    This card uses your component styling settings.
                  </p>
                </div>
              </div>

              {/* Input Examples */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Form Elements
                </Label>
                <Input
                  placeholder="Example input field"
                  style={{
                    borderRadius: `${components.borderRadius}px`,
                    borderWidth: `${components.borderWidth}px`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opacity Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {components.opacityLevels.map((level, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm w-16">Level {index + 1}</span>
                    <span className="text-xs text-muted-foreground w-12">
                      {level}
                    </span>
                    <div
                      className="flex-1 h-8 bg-primary rounded"
                      style={{ opacity: level }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shadow Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {SHADOW_STYLES.slice(1, 5).map((style) => (
                  <div
                    key={style.value}
                    className="p-3 bg-background border rounded text-center"
                    style={{
                      boxShadow: getShadowCSS(style.value),
                      borderRadius: `${components.borderRadius}px`,
                    }}
                  >
                    <span className="text-xs">{style.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Keyboard Instructions */}
      <KeyboardInstructions
        generateAction="generate new component styles"
        navigateAction="navigate style history"
      />
    </div>
  );
}
