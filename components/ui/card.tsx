import * as React from "react";
import { useAtomValue } from "jotai";

import {
  BaseCard,
  BaseCardHeader,
  BaseCardFooter,
  BaseCardTitle,
  BaseCardAction,
  BaseCardDescription,
  BaseCardContent,
} from "./base-card";
import {
  previewCSSAtom,
  componentsAtom,
  spacingAtom,
} from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Card component with design system integration
export interface CardProps extends React.ComponentProps<"div"> {
  dsTheme?: "primary" | "secondary" | "neutral" | "auto";
  dsSpacing?: "compact" | "comfortable" | "spacious" | "auto";
  dsElevation?: "none" | "subtle" | "medium" | "high" | "auto";
  showDesignTokens?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      dsTheme = "auto",
      dsSpacing = "auto",
      dsElevation = "auto",
      showDesignTokens = false,
      style,
      ...props
    },
    ref
  ) => {
    const previewCSS = useAtomValue(previewCSSAtom);
    const components = useAtomValue(componentsAtom);
    const spacing = useAtomValue(spacingAtom);

    // Generate dynamic styles based on design system state
    const dynamicStyles = React.useMemo(() => {
      const styles: CSSCustomProperties = { ...style };

      // Apply theme-specific background
      if (dsTheme !== "auto") {
        const themeColorKey = `--${
          dsTheme === "neutral" ? "background" : dsTheme
        }-color`;
        if (previewCSS[themeColorKey]) {
          styles["--card-bg"] = previewCSS[themeColorKey];
        }
      }

      // Apply border radius from design system
      if (previewCSS["--border-radius"]) {
        styles["--card-radius"] = previewCSS["--border-radius"];
      }

      // Apply spacing from design system
      if (dsSpacing !== "auto") {
        const spacingMap = {
          compact: spacing.tokens.sm,
          comfortable: spacing.tokens.md,
          spacious: spacing.tokens.lg,
        };
        styles["--card-padding"] = spacingMap[dsSpacing] || spacing.tokens.md;
      }

      // Apply elevation from design system
      if (dsElevation !== "auto") {
        const elevationMap = {
          none: "none",
          subtle: "0 1px 3px rgba(0, 0, 0, 0.1)",
          medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
          high: "0 8px 24px rgba(0, 0, 0, 0.2)",
        };
        styles.boxShadow = elevationMap[dsElevation];
      }

      return styles;
    }, [previewCSS, dsTheme, dsSpacing, dsElevation, spacing, style]);

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Design system responsive classes
      dsTheme !== "auto" && "ds-themed",
      dsSpacing !== "auto" && `ds-spacing-${dsSpacing}`,
      dsElevation !== "auto" && `ds-elevation-${dsElevation}`,
      showDesignTokens && "ds-debug",
      // Border radius from design system
      components.borderRadius && `rounded-[${components.borderRadius}px]`,
      className
    );

    return (
      <BaseCard
        ref={ref}
        className={enhancedClassName}
        style={dynamicStyles}
        data-ds-theme={dsTheme}
        data-ds-spacing={dsSpacing}
        data-ds-elevation={dsElevation}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

// Enhanced sub-components with design system integration
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const spacing = useAtomValue(spacingAtom);

  return (
    <BaseCardHeader
      ref={ref}
      className={cn(`gap-[${spacing.tokens.sm}]`, className)}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const previewCSS = useAtomValue(previewCSSAtom);

    const dynamicStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {};
      if (previewCSS["--text-h3"]) {
        styles.fontSize = previewCSS["--text-h3"];
      }
      if (previewCSS["--line-height-h3"]) {
        styles.lineHeight = previewCSS["--line-height-h3"];
      }
      return styles;
    }, [previewCSS]);

    return (
      <BaseCardTitle
        ref={ref}
        className={className}
        style={dynamicStyles}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const previewCSS = useAtomValue(previewCSSAtom);

  const dynamicStyles = React.useMemo(() => {
    const styles: React.CSSProperties = {};
    if (previewCSS["--text-body"]) {
      styles.fontSize = previewCSS["--text-body"];
    }
    if (previewCSS["--line-height-body"]) {
      styles.lineHeight = previewCSS["--line-height-body"];
    }
    return styles;
  }, [previewCSS]);

  return (
    <BaseCardDescription
      ref={ref}
      className={className}
      style={dynamicStyles}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <BaseCardAction ref={ref} className={className} {...props} />
));
CardAction.displayName = "CardAction";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const spacing = useAtomValue(spacingAtom);

  return (
    <BaseCardContent
      ref={ref}
      className={cn(`px-[${spacing.tokens.md}]`, className)}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const spacing = useAtomValue(spacingAtom);

  return (
    <BaseCardFooter
      ref={ref}
      className={cn(`px-[${spacing.tokens.md}]`, className)}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
