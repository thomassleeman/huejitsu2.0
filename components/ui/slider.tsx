"use client";

import * as React from "react";
import { useAtomValue } from "jotai";

import { BaseSlider } from "./base-slider";
import { previewCSSAtom } from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Slider component with design system integration
export interface SliderProps extends React.ComponentProps<typeof BaseSlider> {
  dsTheme?: "primary" | "secondary" | "accent" | "auto";
  dsSize?: "sm" | "default" | "lg";
  dsVariant?: "default" | "range" | "stepped";
  showValue?: boolean;
  showDesignTokens?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof BaseSlider>,
  SliderProps
>(
  (
    {
      className,
      dsTheme = "auto",
      dsSize = "default",
      dsVariant = "default",
      showValue = false,
      showDesignTokens = false,
      value,
      defaultValue,
      style,
      ...props
    },
    ref
  ) => {
    const previewCSS = useAtomValue(previewCSSAtom);

    // Generate dynamic styles based on design system state
    const dynamicStyles = React.useMemo(() => {
      const styles: CSSCustomProperties = { ...style };

      // Apply theme colors for track and thumb
      if (dsTheme !== "auto") {
        const themeColorKey = `--${dsTheme}-color`;
        if (previewCSS[themeColorKey]) {
          styles["--slider-primary"] = previewCSS[themeColorKey];
        }
      }

      // Apply sizing
      const sizeMap = {
        sm: { track: "h-1", thumb: "size-3" },
        default: { track: "h-1.5", thumb: "size-4" },
        lg: { track: "h-2", thumb: "size-5" },
      };

      const currentSize = sizeMap[dsSize];
      if (currentSize) {
        styles["--slider-track-size"] = currentSize.track;
        styles["--slider-thumb-size"] = currentSize.thumb;
      }

      return styles;
    }, [previewCSS, dsTheme, dsSize, style]);

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Size variants
      dsSize === "sm" &&
        "[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-thumb]]:size-3",
      dsSize === "lg" &&
        "[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-thumb]]:size-5",
      // Theme variants
      dsTheme !== "auto" && "ds-themed",
      // Variant classes
      dsVariant === "stepped" && "snap-x snap-mandatory",
      showDesignTokens && "ds-debug",
      className
    );

    // Get current value for display
    const currentValues = React.useMemo(() => {
      if (Array.isArray(value)) return value;
      if (Array.isArray(defaultValue)) return defaultValue;
      return [props.min || 0];
    }, [value, defaultValue, props.min]);

    return (
      <div className="w-full space-y-2">
        <BaseSlider
          ref={ref}
          className={enhancedClassName}
          style={dynamicStyles}
          value={value}
          defaultValue={defaultValue}
          data-ds-theme={dsTheme}
          data-ds-size={dsSize}
          data-ds-variant={dsVariant}
          {...props}
        />
        {showValue && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{props.min || 0}</span>
            {currentValues.length === 1 ? (
              <span className="font-medium">{currentValues[0]}</span>
            ) : (
              <span className="font-medium">{currentValues.join(" - ")}</span>
            )}
            <span>{props.max || 100}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
