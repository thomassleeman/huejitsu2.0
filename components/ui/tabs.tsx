"use client";

import * as React from "react";
import { useAtomValue } from "jotai";

import {
  BaseTabs,
  BaseTabsList,
  BaseTabsTrigger,
  BaseTabsContent,
} from "./base-tabs";
import {
  previewCSSAtom,
  componentsAtom,
  spacingAtom,
} from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Tabs components with design system integration
export interface TabsProps extends React.ComponentProps<typeof BaseTabs> {
  dsOrientation?: "horizontal" | "vertical";
  dsVariant?: "default" | "pills" | "underline";
  dsSpacing?: "compact" | "comfortable" | "spacious" | "auto";
  showDesignTokens?: boolean;
}

export interface TabsListProps
  extends React.ComponentProps<typeof BaseTabsList> {
  dsSize?: "sm" | "default" | "lg";
}

const Tabs = React.forwardRef<React.ElementRef<typeof BaseTabs>, TabsProps>(
  (
    {
      className,
      dsOrientation = "horizontal",
      dsVariant = "default",
      dsSpacing = "auto",
      showDesignTokens = false,
      ...props
    },
    ref
  ) => {
    const spacing = useAtomValue(spacingAtom);

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Orientation
      dsOrientation === "vertical" && "flex-row gap-4",
      // Spacing variants
      dsSpacing === "compact" && "gap-1",
      dsSpacing === "spacious" && "gap-4",
      dsSpacing !== "auto" &&
        spacing.tokens[dsSpacing] &&
        `gap-[${spacing.tokens[dsSpacing]}]`,
      // Design system classes
      showDesignTokens && "ds-debug",
      className
    );

    return (
      <BaseTabs
        ref={ref}
        className={enhancedClassName}
        orientation={dsOrientation}
        data-ds-orientation={dsOrientation}
        data-ds-variant={dsVariant}
        data-ds-spacing={dsSpacing}
        {...props}
      />
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  React.ElementRef<typeof BaseTabsList>,
  TabsListProps
>(({ className, dsSize = "default", ...props }, ref) => {
  const previewCSS = useAtomValue(previewCSSAtom);
  const components = useAtomValue(componentsAtom);

  // Generate dynamic styles based on design system state
  const dynamicStyles = React.useMemo(() => {
    const styles: CSSCustomProperties = {};

    // Apply border radius from design system
    if (previewCSS["--border-radius"]) {
      styles["--tabs-list-radius"] = previewCSS["--border-radius"];
    }

    return styles;
  }, [previewCSS]);

  // Enhanced className with design system integration
  const enhancedClassName = cn(
    // Size variants
    dsSize === "sm" && "h-8 p-[2px]",
    dsSize === "lg" && "h-11 p-1",
    // Design system classes
    components.borderRadius && `rounded-[${components.borderRadius}px]`,
    className
  );

  return (
    <BaseTabsList
      ref={ref}
      className={enhancedClassName}
      style={dynamicStyles}
      data-ds-size={dsSize}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof BaseTabsTrigger>,
  React.ComponentProps<typeof BaseTabsTrigger>
>(({ className, ...props }, ref) => {
  const previewCSS = useAtomValue(previewCSSAtom);

  // Generate dynamic styles based on design system state
  const dynamicStyles = React.useMemo(() => {
    const styles: CSSCustomProperties = {};

    // Apply border radius from design system
    if (previewCSS["--border-radius"]) {
      const radius = parseInt(previewCSS["--border-radius"]) - 2; // Slightly smaller than parent
      styles["--tabs-trigger-radius"] = `${Math.max(radius, 2)}px`;
    }

    return styles;
  }, [previewCSS]);

  // Enhanced className with design system integration
  const enhancedClassName = cn(
    // Use dynamic styles instead of dynamic classes for border radius
    className
  );

  return (
    <BaseTabsTrigger
      ref={ref}
      className={enhancedClassName}
      style={dynamicStyles}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof BaseTabsContent>,
  React.ComponentProps<typeof BaseTabsContent>
>(({ className, ...props }, ref) => {
  return (
    <BaseTabsContent
      ref={ref}
      className={cn(
        // Add consistent spacing
        "mt-4",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
