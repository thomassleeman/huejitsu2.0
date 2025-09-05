"use client";

import * as React from "react";
import { useAtomValue } from "jotai";

import {
  BaseSelect,
  BaseSelectContent,
  BaseSelectGroup,
  BaseSelectItem,
  BaseSelectLabel,
  BaseSelectScrollDownButton,
  BaseSelectScrollUpButton,
  BaseSelectSeparator,
  BaseSelectTrigger,
  BaseSelectValue,
} from "./base-select";
import { previewCSSAtom, componentsAtom } from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Select components with design system integration
export interface SelectTriggerProps
  extends React.ComponentProps<typeof BaseSelectTrigger> {
  dsTheme?: "primary" | "secondary" | "auto";
  dsSize?: "sm" | "default" | "lg";
  showDesignTokens?: boolean;
}

const Select = BaseSelect;

const SelectGroup = BaseSelectGroup;

const SelectValue = BaseSelectValue;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof BaseSelectTrigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      size = "default",
      dsTheme = "auto",
      dsSize = "default",
      showDesignTokens = false,
      style,
      ...props
    },
    ref
  ) => {
    const previewCSS = useAtomValue(previewCSSAtom);
    const components = useAtomValue(componentsAtom);

    // Generate dynamic styles based on design system state
    const dynamicStyles = React.useMemo(() => {
      const styles: CSSCustomProperties = { ...style };

      // Apply theme colors
      if (dsTheme !== "auto") {
        const themeColorKey = `--${dsTheme}-color`;
        if (previewCSS[themeColorKey]) {
          styles["--select-accent"] = previewCSS[themeColorKey];
        }
      }

      // Apply border radius from design system
      if (previewCSS["--border-radius"]) {
        styles["--select-radius"] = previewCSS["--border-radius"];
      }

      return styles;
    }, [previewCSS, dsTheme, style]);

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Size variants
      dsSize === "sm" && "h-8 px-2 text-sm",
      dsSize === "lg" && "h-11 px-4 text-base",
      // Theme variants
      dsTheme !== "auto" && "ds-themed",
      showDesignTokens && "ds-debug",
      components.borderRadius && `rounded-[${components.borderRadius}px]`,
      className
    );

    return (
      <BaseSelectTrigger
        ref={ref}
        className={enhancedClassName}
        size={
          dsSize === "lg" ? "default" : dsSize === "default" ? size : dsSize
        }
        style={dynamicStyles}
        data-ds-theme={dsTheme}
        data-ds-size={dsSize}
        {...props}
      />
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof BaseSelectContent>,
  React.ComponentProps<typeof BaseSelectContent>
>(({ className, ...props }, ref) => {
  const previewCSS = useAtomValue(previewCSSAtom);
  const components = useAtomValue(componentsAtom);

  const dynamicStyles = React.useMemo(() => {
    const styles: CSSCustomProperties = {};

    // Apply border radius from design system
    if (previewCSS["--border-radius"]) {
      styles["--select-content-radius"] = previewCSS["--border-radius"];
    }

    return styles;
  }, [previewCSS]);

  return (
    <BaseSelectContent
      ref={ref}
      className={cn(
        components.borderRadius && `rounded-[${components.borderRadius}px]`,
        className
      )}
      style={dynamicStyles}
      {...props}
    />
  );
});
SelectContent.displayName = "SelectContent";

const SelectLabel = BaseSelectLabel;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof BaseSelectItem>,
  React.ComponentProps<typeof BaseSelectItem>
>(({ className, ...props }, ref) => {
  return <BaseSelectItem ref={ref} className={className} {...props} />;
});
SelectItem.displayName = "SelectItem";

const SelectSeparator = BaseSelectSeparator;

const SelectScrollUpButton = BaseSelectScrollUpButton;

const SelectScrollDownButton = BaseSelectScrollDownButton;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
