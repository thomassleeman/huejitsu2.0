"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { iconsAtom, pinningStateAtom } from "@/atoms/design-system";
import { generateIconVariation } from "@/lib/icons/generateIconVariation";
import { useCreativeIteration } from "@/hooks/useCreativeIteration";
import { KeyboardInstructions } from "@/components/ui/KeyboardInstructions";
import { PinButton } from "@/components/ui/PinButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Star,
  Home,
  User,
  Settings,
  Search,
  Bell,
  Mail,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
} from "lucide-react";

const ICON_LIBRARIES = [
  { value: "lucide", label: "Lucide (Default)" },
  { value: "heroicons", label: "Heroicons" },
  { value: "phosphor", label: "Phosphor" },
  { value: "tabler", label: "Tabler" },
  { value: "feather", label: "Feather" },
  { value: "remix", label: "Remix Icon" },
  { value: "carbon", label: "Carbon" },
  { value: "octicons", label: "Octicons" },
] as const;

const ICON_WEIGHTS = [
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "regular", label: "Regular" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
] as const;

const ICON_STYLE_PRESETS = [
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "playful", label: "Playful" },
  { value: "tech", label: "Tech" },
] as const;

// Example icons for preview
const EXAMPLE_ICONS = [
  { Icon: Heart, name: "Heart" },
  { Icon: Star, name: "Star" },
  { Icon: Home, name: "Home" },
  { Icon: User, name: "User" },
  { Icon: Settings, name: "Settings" },
  { Icon: Search, name: "Search" },
  { Icon: Bell, name: "Bell" },
  { Icon: Mail, name: "Mail" },
  { Icon: Download, name: "Download" },
  { Icon: Upload, name: "Upload" },
  { Icon: Edit, name: "Edit" },
  { Icon: Trash2, name: "Delete" },
  { Icon: Plus, name: "Add" },
  { Icon: Minus, name: "Remove" },
  { Icon: X, name: "Close" },
  { Icon: Check, name: "Check" },
];

export function IconsTab() {
  const [icons, setIcons] = useAtom(iconsAtom);
  const [pinning, setPinning] = useAtom(pinningStateAtom);

  // Generation function that respects pinning
  const generateVariation = useCallback(() => {
    return generateIconVariation(icons, {
      pinnedLibrary: pinning.icons.library,
      pinnedWeight: pinning.icons.weight,
      pinnedSizeScale: pinning.icons.sizeScale,
    });
  }, [icons, pinning.icons]);

  // Creative iteration hook
  const iteration = useCreativeIteration({
    initialData: icons,
    generateFunction: generateVariation,
    onDataChange: setIcons,
  });

  // Toggle pinning functions
  const togglePin = (property: keyof typeof pinning.icons) => {
    setPinning((prev) => ({
      ...prev,
      icons: {
        ...prev.icons,
        [property]: !prev.icons[property],
      },
    }));
  };

  // Manual change handlers
  const handleLibraryChange = (value: string) => {
    setIcons((prev) => ({ ...prev, library: value as "lucide" | "heroicons" }));
  };

  const handleWeightChange = (value: string) => {
    setIcons((prev) => ({ ...prev, weight: value }));
  };

  const applyIconStyle = (style: string) => {
    const variation = generateIconVariation(undefined, {
      style: style as
        | "minimal"
        | "bold"
        | "friendly"
        | "professional"
        | "playful"
        | "tech",
    });
    setIcons(variation);
  };

  // Get stroke width based on weight
  const getStrokeWidth = (weight: string) => {
    const weights = {
      thin: 1,
      light: 1.25,
      regular: 1.5,
      medium: 1.75,
      semibold: 2,
      bold: 2.5,
    };
    return weights[weight as keyof typeof weights] || 1.5;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with iteration info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Icon System</h2>
          {iteration.history.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Configuration {iteration.currentIndex + 1} of{" "}
              {iteration.history.length}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Select onValueChange={applyIconStyle}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Apply style preset" />
            </SelectTrigger>
            <SelectContent>
              {ICON_STYLE_PRESETS.map((style) => (
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
              <CardTitle>Icon Library & Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="iconLibrary">Icon Library</Label>
                  <PinButton
                    isPinned={pinning.icons.library}
                    onToggle={() => togglePin("library")}
                    size="sm"
                  />
                </div>
                <Select
                  value={icons.library}
                  onValueChange={handleLibraryChange}
                  disabled={pinning.icons.library}
                >
                  <SelectTrigger id="iconLibrary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_LIBRARIES.map((library) => (
                      <SelectItem key={library.value} value={library.value}>
                        {library.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Currently showing Lucide icons as example
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="iconWeight">Icon Weight/Style</Label>
                  <PinButton
                    isPinned={pinning.icons.weight}
                    onToggle={() => togglePin("weight")}
                    size="sm"
                  />
                </div>
                <Select
                  value={icons.weight}
                  onValueChange={handleWeightChange}
                  disabled={pinning.icons.weight}
                >
                  <SelectTrigger id="iconWeight">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_WEIGHTS.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Size Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Label>Size Scale</Label>
                <PinButton
                  isPinned={pinning.icons.sizeScale}
                  onToggle={() => togglePin("sizeScale")}
                  size="sm"
                />
              </div>
              <div className="text-sm font-mono bg-muted p-3 rounded mb-4">
                [{icons.sizeScale.join(", ")}]px
              </div>

              <div className="space-y-3">
                {icons.sizeScale.map((size, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm w-12">{size}px</span>
                    <div className="flex items-center justify-center w-16 h-8 border rounded">
                      <Heart
                        size={size}
                        strokeWidth={getStrokeWidth(icons.weight)}
                        className="text-primary"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {index === 0 && "XS"}
                      {index === 1 && "SM"}
                      {index === 2 && "MD"}
                      {index === 3 && "LG"}
                      {index === 4 && "XL"}
                      {index > 4 && `${index - 2}XL`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Use consistent stroke width across interface</p>
                <p>• Maintain 44px minimum touch targets on mobile</p>
                <p>• Consider accessibility with sufficient contrast</p>
                <p>• Align icon sizes with your typography scale</p>
                <p>• Test readability at smallest sizes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Icon Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {EXAMPLE_ICONS.slice(0, 12).map(({ Icon, name }) => (
                  <div key={name} className="text-center">
                    <div className="flex items-center justify-center h-12 mb-2">
                      <Icon
                        size={icons.sizeScale[2] || 24}
                        strokeWidth={getStrokeWidth(icons.weight)}
                        className="text-foreground"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Size Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 justify-center">
                {icons.sizeScale.slice(0, 6).map((size, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="flex items-center justify-center mb-2"
                      style={{ height: `${Math.max(size, 20)}px` }}
                    >
                      <Star
                        size={size}
                        strokeWidth={getStrokeWidth(icons.weight)}
                        className="text-primary"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {size}px
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {ICON_WEIGHTS.slice(0, 6).map((weight) => (
                  <div key={weight.value} className="text-center">
                    <div className="flex items-center justify-center h-16 mb-2">
                      <Settings
                        size={32}
                        strokeWidth={getStrokeWidth(weight.value)}
                        className="text-foreground"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {weight.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Button with icon */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Buttons with Icons
                  </Label>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Download
                        size={icons.sizeScale[1] || 16}
                        strokeWidth={getStrokeWidth(icons.weight)}
                        className="mr-2"
                      />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings
                        size={icons.sizeScale[1] || 16}
                        strokeWidth={getStrokeWidth(icons.weight)}
                        className="mr-2"
                      />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* List items with icons */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Navigation Items
                  </Label>
                  <div className="space-y-2">
                    {[
                      { Icon: Home, label: "Dashboard" },
                      { Icon: User, label: "Profile" },
                      { Icon: Bell, label: "Notifications" },
                      { Icon: Mail, label: "Messages" },
                    ].map(({ Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 p-2 rounded hover:bg-muted"
                      >
                        <Icon
                          size={icons.sizeScale[1] || 18}
                          strokeWidth={getStrokeWidth(icons.weight)}
                          className="text-muted-foreground"
                        />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Keyboard Instructions */}
      <KeyboardInstructions
        generateAction="generate new icon configurations"
        navigateAction="navigate icon history"
      />
    </div>
  );
}
