"use client";

import * as React from "react";
import { useAtomValue } from "jotai";

import {
  BaseDialog,
  BaseDialogClose,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogOverlay,
  BaseDialogPortal,
  BaseDialogTitle,
  BaseDialogTrigger,
} from "./base-dialog";
import {
  previewCSSAtom,
  componentsAtom,
  spacingAtom,
} from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Dialog components with design system integration
export interface DialogContentProps
  extends React.ComponentProps<typeof BaseDialogContent> {
  dsSize?: "sm" | "default" | "lg" | "xl";
  dsSpacing?: "compact" | "comfortable" | "spacious" | "auto";
  showDesignTokens?: boolean;
}

const Dialog = BaseDialog;

const DialogTrigger = BaseDialogTrigger;

const DialogPortal = BaseDialogPortal;

const DialogClose = BaseDialogClose;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof BaseDialogOverlay>,
  React.ComponentProps<typeof BaseDialogOverlay>
>(({ className, style, ...props }, ref) => {
  const components = useAtomValue(componentsAtom);

  const dynamicStyles = React.useMemo(() => {
    const styles: React.CSSProperties = { ...style };

    // Apply opacity levels from design system
    if (components.opacityLevels.length > 0) {
      const overlayOpacity = components.opacityLevels[2] || 0.5; // Use middle opacity level
      styles.backgroundColor = `rgba(0, 0, 0, ${overlayOpacity})`;
    }

    return styles;
  }, [components, style]);

  return (
    <BaseDialogOverlay
      ref={ref}
      className={className}
      style={dynamicStyles}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialogContent>,
  DialogContentProps
>(
  (
    {
      className,
      dsSize = "default",
      dsSpacing = "auto",
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

      // Apply border radius from design system
      if (previewCSS["--border-radius"]) {
        styles["--dialog-radius"] = previewCSS["--border-radius"];
      }

      // Apply spacing from design system
      if (dsSpacing !== "auto") {
        const spacingMap = {
          compact: spacing.tokens.sm,
          comfortable: spacing.tokens.md,
          spacious: spacing.tokens.lg,
        };
        styles["--dialog-padding"] = spacingMap[dsSpacing] || spacing.tokens.md;
      }

      return styles;
    }, [previewCSS, dsSpacing, spacing, style]);

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Size variants
      dsSize === "sm" && "sm:max-w-sm",
      dsSize === "lg" && "sm:max-w-2xl",
      dsSize === "xl" && "sm:max-w-4xl",
      // Spacing variants
      dsSpacing === "compact" && "gap-2 p-4",
      dsSpacing === "spacious" && "gap-6 p-8",
      // Design system classes
      showDesignTokens && "ds-debug",
      components.borderRadius && `rounded-[${components.borderRadius}px]`,
      className
    );

    return (
      <BaseDialogContent
        ref={ref}
        className={enhancedClassName}
        style={dynamicStyles}
        data-ds-size={dsSize}
        data-ds-spacing={dsSpacing}
        {...props}
      />
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDialogHeader>
>(({ className, ...props }, ref) => {
  const spacing = useAtomValue(spacingAtom);

  return (
    <BaseDialogHeader
      ref={ref}
      className={cn(`gap-[${spacing.tokens.sm}]`, className)}
      {...props}
    />
  );
});
DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDialogFooter>
>(({ className, ...props }, ref) => {
  const spacing = useAtomValue(spacingAtom);

  return (
    <BaseDialogFooter
      ref={ref}
      className={cn(`gap-[${spacing.tokens.sm}]`, className)}
      {...props}
    />
  );
});
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof BaseDialogTitle>,
  React.ComponentProps<typeof BaseDialogTitle>
>(({ className, ...props }, ref) => {
  const previewCSS = useAtomValue(previewCSSAtom);

  const dynamicStyles = React.useMemo(() => {
    const styles: React.CSSProperties = {};
    if (previewCSS["--text-h2"]) {
      styles.fontSize = previewCSS["--text-h2"];
    }
    if (previewCSS["--line-height-h2"]) {
      styles.lineHeight = previewCSS["--line-height-h2"];
    }
    return styles;
  }, [previewCSS]);

  return (
    <BaseDialogTitle
      ref={ref}
      className={className}
      style={dynamicStyles}
      {...props}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof BaseDialogDescription>,
  React.ComponentProps<typeof BaseDialogDescription>
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
    <BaseDialogDescription
      ref={ref}
      className={className}
      style={dynamicStyles}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
