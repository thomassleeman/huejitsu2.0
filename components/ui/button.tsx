import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { useAtomValue } from "jotai";

import { BaseButton, baseButtonVariants } from "./base-button";
import { previewCSSAtom, componentsAtom } from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Button component with design system integration
export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof baseButtonVariants> {
  asChild?: boolean;
  dsTheme?: "primary" | "secondary" | "accent" | "auto";
  dsVariant?: "solid" | "outline" | "ghost" | "link";
  showDesignTokens?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      dsTheme = "auto",
      dsVariant,
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

      // Apply design system theme override
      if (dsTheme !== "auto") {
        const themeColorKey = `--${dsTheme}-color` as const;
        if (previewCSS[themeColorKey]) {
          styles["--button-bg"] = previewCSS[themeColorKey];
        }
      }

      // Apply component-level design tokens
      if (previewCSS["--border-radius"]) {
        styles["--button-radius"] = previewCSS["--border-radius"];
      }

      return styles;
    }, [previewCSS, dsTheme, style]);

    // Map dsVariant to ShadCN variant if provided
    const effectiveVariant = dsVariant
      ? dsVariant === "solid"
        ? "default"
        : dsVariant
      : variant;

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Design system responsive classes
      dsTheme !== "auto" && "ds-themed",
      showDesignTokens && "ds-debug",
      // Border radius from design system
      components.borderRadius && `rounded-[${components.borderRadius}px]`,
      className
    );

    return (
      <BaseButton
        ref={ref}
        className={enhancedClassName}
        variant={effectiveVariant}
        size={size}
        asChild={asChild}
        style={dynamicStyles}
        data-ds-theme={dsTheme}
        data-ds-variant={dsVariant}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, baseButtonVariants as buttonVariants };
