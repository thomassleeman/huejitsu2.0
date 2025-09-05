"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { spacingAtom, pinningStateAtom } from "@/atoms/design-system";
import { generateSpacingVariation } from "@/lib/spacing/generateSpacingVariation";
import { useCreativeIteration } from "@/hooks/useCreativeIteration";
import { KeyboardInstructions } from "@/components/ui/KeyboardInstructions";
import { PinButton } from "@/components/ui/PinButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SpacingTab() {
  const [spacing, setSpacing] = useAtom(spacingAtom);
  const [pinning, setPinning] = useAtom(pinningStateAtom);

  // Generation function that respects pinning
  const generateVariation = useCallback(() => {
    return generateSpacingVariation(spacing, {
      pinnedBaseUnit: pinning.spacing.baseUnit,
      pinnedScale: pinning.spacing.scale,
    });
  }, [spacing, pinning.spacing]);

  // Creative iteration hook
  const iteration = useCreativeIteration({
    initialData: spacing,
    generateFunction: generateVariation,
    onDataChange: setSpacing,
  });

  // Toggle pinning functions
  const toggleBaseUnitPin = () => {
    setPinning((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        baseUnit: !prev.spacing.baseUnit,
      },
    }));
  };

  const toggleScalePin = () => {
    setPinning((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        scale: !prev.spacing.scale,
      },
    }));
  };

  const toggleTokensPin = () => {
    setPinning((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        tokens: !prev.spacing.tokens,
      },
    }));
  };

  // Manual change handlers
  const handleBaseUnitChange = (value: number[]) => {
    setSpacing((prev) => ({ ...prev, baseUnit: value[0] }));
  };

  const handleTokenChange = (
    token: keyof typeof spacing.tokens,
    value: string
  ) => {
    setSpacing((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        [token]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with iteration info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Spacing System</h2>
          {iteration.history.length > 1 && (
            <p className="text-sm text-muted-foreground">
              System {iteration.currentIndex + 1} of {iteration.history.length}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <PinButton
            isPinned={pinning.spacing.baseUnit}
            onToggle={toggleBaseUnitPin}
            label="Base Unit"
          />
          <PinButton
            isPinned={pinning.spacing.scale}
            onToggle={toggleScalePin}
            label="Scale"
          />
          <PinButton
            isPinned={pinning.spacing.tokens}
            onToggle={toggleTokensPin}
            label="Tokens"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Base Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Label>Base Unit: {spacing.baseUnit}px</Label>
                  <PinButton
                    isPinned={pinning.spacing.baseUnit}
                    onToggle={toggleBaseUnitPin}
                    size="sm"
                  />
                </div>
                <Slider
                  value={[spacing.baseUnit]}
                  onValueChange={handleBaseUnitChange}
                  min={2}
                  max={20}
                  step={1}
                  disabled={pinning.spacing.baseUnit}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  The fundamental unit that defines your spacing rhythm
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label>Scale Values</Label>
                  <PinButton
                    isPinned={pinning.spacing.scale}
                    onToggle={toggleScalePin}
                    size="sm"
                  />
                </div>
                <div className="text-sm font-mono bg-muted p-3 rounded">
                  [{spacing.scale.join(", ")}]
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Mathematical progression that creates harmony
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spacing Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(spacing.tokens).map(([token, value]) => (
                <div key={token} className="flex items-center gap-3">
                  <Label className="w-12 text-sm font-mono">{token}</Label>
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleTokenChange(
                        token as keyof typeof spacing.tokens,
                        e.target.value
                      )
                    }
                    className="flex-1 font-mono text-sm"
                    disabled={pinning.spacing.tokens}
                  />
                  <div
                    className="w-8 h-8 bg-primary rounded border"
                    style={{
                      width: value,
                      minWidth: "8px",
                      maxWidth: "64px",
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Scale Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {spacing.scale.map((size, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-mono w-12">{size}px</span>
                    <div
                      className="bg-primary h-4 rounded"
                      style={{ width: `${Math.min(size, 200)}px` }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(spacing.tokens).map(([token, value]) => (
                  <div key={token} className="flex items-center gap-3">
                    <span className="text-sm font-mono w-8">{token}</span>
                    <span className="text-xs text-muted-foreground w-12">
                      {value}
                    </span>
                    <div
                      className="bg-secondary h-3 rounded"
                      style={{ width: value }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border rounded-lg p-4 space-y-4"
                style={{ padding: spacing.tokens.lg }}
              >
                <div
                  className="bg-primary/10 p-3 rounded"
                  style={{
                    padding: spacing.tokens.md,
                    marginBottom: spacing.tokens.sm,
                  }}
                >
                  <h4 className="font-semibold mb-2">Card Header</h4>
                  <p className="text-sm text-muted-foreground">
                    This card uses your spacing tokens for consistent layout.
                  </p>
                </div>

                <div className="flex gap-2" style={{ gap: spacing.tokens.sm }}>
                  <div
                    className="bg-secondary/20 p-2 rounded flex-1"
                    style={{ padding: spacing.tokens.xs }}
                  >
                    <span className="text-xs">Small item</span>
                  </div>
                  <div
                    className="bg-accent/20 p-2 rounded flex-1"
                    style={{ padding: spacing.tokens.xs }}
                  >
                    <span className="text-xs">Small item</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spacing Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• Use consistent mathematical progressions</li>
              <li>• Base unit should divide evenly into your grid</li>
              <li>• Smaller spaces for related elements</li>
            </ul>
            <ul className="space-y-1">
              <li>• Larger spaces for section separation</li>
              <li>• Consider mobile touch targets (44px minimum)</li>
              <li>• Test readability at different screen sizes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Instructions */}
      <KeyboardInstructions
        generateAction="generate new spacing systems"
        navigateAction="navigate spacing history"
      />
    </div>
  );
}

