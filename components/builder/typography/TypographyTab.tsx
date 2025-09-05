"use client";

import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { typographyAtom, pinningStateAtom } from "@/atoms/design-system";
import { generateTypographyVariation } from "@/lib/typography/generateTypographyVariation";
import { useCreativeIteration } from "@/hooks/useCreativeIteration";
import { KeyboardInstructions } from "@/components/ui/KeyboardInstructions";
import { PinButton } from "@/components/ui/PinButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Available fonts list with their Google Fonts names
const AVAILABLE_FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Raleway", label: "Raleway" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Crimson Text", label: "Crimson Text" },
  { value: "Libre Baskerville", label: "Libre Baskerville" },
  { value: "Oswald", label: "Oswald" },
  { value: "Nunito", label: "Nunito" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "Quicksand", label: "Quicksand" },
];

export function TypographyTab() {
  const [typography, setTypography] = useAtom(typographyAtom);
  const [pinning, setPinning] = useAtom(pinningStateAtom);

  // Generation function that respects pinning
  const generateVariation = useCallback(() => {
    return generateTypographyVariation(typography, {
      pinnedFont: pinning.typography.primaryFont
        ? "primary"
        : pinning.typography.secondaryFont
        ? "secondary"
        : undefined,
      pinnedScale: pinning.typography.typeScale,
    });
  }, [typography, pinning.typography]);

  // Creative iteration hook
  const iteration = useCreativeIteration({
    initialData: typography,
    generateFunction: generateVariation,
    onDataChange: setTypography,
  });

  // Load Google Fonts dynamically
  useEffect(() => {
    const loadFonts = () => {
      // Remove existing font link if any
      const existingLink = document.getElementById("google-fonts-link");
      if (existingLink) {
        existingLink.remove();
      }

      // Create fonts to load string
      const fontsToLoad = [
        typography.primaryFont.replace(" ", "+"),
        typography.secondaryFont.replace(" ", "+"),
      ]
        .filter((font, index, self) => self.indexOf(font) === index) // Remove duplicates
        .join("&family=");

      // Create and append new font link
      const link = document.createElement("link");
      link.id = "google-fonts-link";
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}:wght@300;400;500;600;700;900&display=swap`;
      document.head.appendChild(link);
    };

    loadFonts();
  }, [typography.primaryFont, typography.secondaryFont]);

  // Toggle pinning functions
  const togglePrimaryFontPin = () => {
    setPinning((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        primaryFont: !prev.typography.primaryFont,
      },
    }));
  };

  const toggleSecondaryFontPin = () => {
    setPinning((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        secondaryFont: !prev.typography.secondaryFont,
      },
    }));
  };

  const toggleTypeScalePin = () => {
    setPinning((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        typeScale: !prev.typography.typeScale,
      },
    }));
  };

  // Apply font styles
  const headingsFontStyle = {
    fontFamily: `'${typography.primaryFont}', sans-serif`,
  };

  const bodyFontStyle = {
    fontFamily: `'${typography.secondaryFont}', sans-serif`,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with iteration info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Typography System</h2>
          {iteration.history.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Variation {iteration.currentIndex + 1} of{" "}
              {iteration.history.length}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <PinButton
            isPinned={pinning.typography.primaryFont}
            onToggle={togglePrimaryFontPin}
            label="Primary Font"
          />
          <PinButton
            isPinned={pinning.typography.secondaryFont}
            onToggle={toggleSecondaryFontPin}
            label="Secondary Font"
          />
          <PinButton
            isPinned={pinning.typography.typeScale}
            onToggle={toggleTypeScalePin}
            label="Type Scale"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Font Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="primaryFont">Primary Font (Headings)</Label>
                  <PinButton
                    isPinned={pinning.typography.primaryFont}
                    onToggle={togglePrimaryFontPin}
                    size="sm"
                  />
                </div>
                <Select
                  onValueChange={(value) =>
                    setTypography((prev) => ({ ...prev, primaryFont: value }))
                  }
                  value={typography.primaryFont}
                  disabled={pinning.typography.primaryFont}
                >
                  <SelectTrigger id="primaryFont">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_FONTS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="secondaryFont">Secondary Font (Body)</Label>
                  <PinButton
                    isPinned={pinning.typography.secondaryFont}
                    onToggle={toggleSecondaryFontPin}
                    size="sm"
                  />
                </div>
                <Select
                  onValueChange={(value) =>
                    setTypography((prev) => ({ ...prev, secondaryFont: value }))
                  }
                  value={typography.secondaryFont}
                  disabled={pinning.typography.secondaryFont}
                >
                  <SelectTrigger id="secondaryFont">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_FONTS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Font Pairing Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Font Pairing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Pair a serif with a sans-serif for contrast</li>
                <li>• Use fonts from the same family for harmony</li>
                <li>• Limit to 2-3 fonts maximum</li>
                <li>• Ensure good readability at all sizes</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-4xl font-bold mb-4" style={headingsFontStyle}>
                Typography Preview
              </h1>
              <h2
                className="text-2xl font-semibold mb-3"
                style={headingsFontStyle}
              >
                Subheading Style
              </h2>
              <h3
                className="text-xl font-medium mb-4"
                style={headingsFontStyle}
              >
                Tertiary Heading Example
              </h3>
              <p
                className="text-base mb-4 leading-relaxed"
                style={bodyFontStyle}
              >
                This is body text using the body font. Good typography
                establishes a strong visual hierarchy, provides a good reading
                experience, and helps users navigate your content. The body font
                is used for most of the content, while the headings font is
                reserved for titles and section headers.
              </p>
              <p
                className="text-sm text-muted-foreground mb-4"
                style={bodyFontStyle}
              >
                Small text example: Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </CardContent>
          </Card>

          {/* Character Samples */}
          <Card>
            <CardHeader>
              <CardTitle>Character Samples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 overflow-x-auto">
              <div>
                <span className="text-xs text-muted-foreground">
                  Primary Font:
                </span>
                <p style={headingsFontStyle} className="text-lg font-mono">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Secondary Font:
                </span>
                <p style={bodyFontStyle} className="text-lg font-mono">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Keyboard Instructions */}
      <KeyboardInstructions
        generateAction="generate new font combinations"
        navigateAction="navigate font history"
      />
    </div>
  );
}

