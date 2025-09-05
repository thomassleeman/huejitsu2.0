"use client";

import * as React from "react";
import { useAtomValue } from "jotai";

import {
  BaseTooltip,
  BaseTooltipTrigger,
  BaseTooltipContent,
  BaseTooltipProvider,
} from "./base-tooltip";
import {
  previewCSSAtom,
  componentsAtom,
  colorsAtom,
} from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Tooltip components with design system integration
export interface TooltipContentProps
  extends React.ComponentProps<typeof BaseTooltipContent> {
  dsTheme?: "primary" | "secondary" | "neutral" | "auto";
  dsSize?: "sm" | "default" | "lg";
  showArrow?: boolean;
  showDesignTokens?: boolean;
}

const TooltipProvider = BaseTooltipProvider;

const Tooltip = BaseTooltip;

const TooltipTrigger = BaseTooltipTrigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof BaseTooltipContent>,
  TooltipContentProps
>(
  (
    {
      className,
      dsTheme = "auto",
      dsSize = "default",
      showArrow = true,
      showDesignTokens = false,
      sideOffset = 4,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const previewCSS = useAtomValue(previewCSSAtom);
    const components = useAtomValue(componentsAtom);
    const colors = useAtomValue(colorsAtom);

    // Generate dynamic styles based on design system state
    const dynamicStyles = React.useMemo(() => {
      const styles: CSSCustomProperties = { ...style };

      // Apply theme colors
      if (dsTheme !== "auto") {
        if (dsTheme === "neutral") {
          styles.backgroundColor = colors.background;
          styles.color = colors.text;
          styles.border = `1px solid ${colors.text}20`;
        } else {
          const themeColorKey = `--${dsTheme}-color`;
          if (previewCSS[themeColorKey]) {
            styles.backgroundColor = previewCSS[themeColorKey];
            styles.color = "#ffffff";
          }
        }
      }

      // Apply border radius from design system
      if (previewCSS["--border-radius"]) {
        styles["--tooltip-radius"] = previewCSS["--border-radius"];
      }

      // Apply typography from design system
      if (previewCSS["--text-caption"] && dsSize === "sm") {
        styles.fontSize = previewCSS["--text-caption"];
      }

      return styles;
    }, [previewCSS, dsTheme, dsSize, colors, style]);

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Size variants
      dsSize === "sm" && "px-2 py-1 text-xs",
      dsSize === "lg" && "px-4 py-2 text-sm",
      // Theme variants
      dsTheme === "neutral" && "bg-background text-foreground border shadow-md",
      dsTheme !== "auto" && dsTheme !== "neutral" && "ds-themed",
      // Design system classes
      showDesignTokens && "ds-debug",
      components.borderRadius && `rounded-[${components.borderRadius}px]`,
      className
    );

    return (
      <BaseTooltipContent
        ref={ref}
        className={enhancedClassName}
        style={dynamicStyles}
        sideOffset={sideOffset}
        data-ds-theme={dsTheme}
        data-ds-size={dsSize}
        {...props}
      >
        {children}
        {/* Custom arrow handling based on theme */}
        {!showArrow && (
          <style jsx>{`
            [data-slot="tooltip-content"] > [data-radix-popper-arrow-wrapper] {
              display: none;
            }
          `}</style>
        )}
      </BaseTooltipContent>
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
