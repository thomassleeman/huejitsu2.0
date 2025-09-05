import * as React from "react";
import { useAtomValue } from "jotai";

import { BaseInput } from "./base-input";
import {
  previewCSSAtom,
  componentsAtom,
  colorsAtom,
} from "@/atoms/design-system";
import { cn } from "@/lib/utils";
import { CSSCustomProperties } from "@/types/css";

// Enhanced Input component with design system integration
export interface InputProps extends React.ComponentProps<"input"> {
  dsVariant?: "default" | "filled" | "underlined";
  dsSize?: "sm" | "default" | "lg";
  dsState?: "default" | "error" | "success" | "warning";
  showValidation?: boolean;
  validationMessage?: string;
  showDesignTokens?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      dsVariant = "default",
      dsSize = "default",
      dsState = "default",
      showValidation = false,
      validationMessage,
      showDesignTokens = false,
      style,
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

      // Apply border radius from design system
      if (previewCSS["--border-radius"]) {
        styles["--input-radius"] = previewCSS["--border-radius"];
      }

      // Apply state-specific colors
      if (dsState !== "default") {
        const stateColors = {
          error: "#EF4444",
          success: "#10B981",
          warning: "#F59E0B",
        };
        const stateColor = stateColors[dsState as keyof typeof stateColors];
        if (stateColor) {
          styles["--input-border-color"] = stateColor;
          styles["--input-focus-color"] = stateColor;
        }
      }

      // Apply variant-specific styling
      if (dsVariant === "filled") {
        styles.backgroundColor = colors.background;
        styles.border = "none";
      } else if (dsVariant === "underlined") {
        styles.border = "none";
        styles.borderBottom = `1px solid ${colors.text}20`;
        styles.borderRadius = "0";
      }

      return styles;
    }, [previewCSS, colors, dsState, dsVariant, style]);

    // Enhanced className with design system integration
    const enhancedClassName = cn(
      // Size variants
      dsSize === "sm" && "h-8 px-2 text-sm",
      dsSize === "lg" && "h-11 px-4 text-base",
      // Variant classes
      dsVariant === "filled" && "bg-muted border-transparent",
      dsVariant === "underlined" && "border-0 border-b rounded-none",
      // State classes
      dsState === "error" &&
        "border-destructive focus-visible:ring-destructive/20",
      dsState === "success" &&
        "border-green-500 focus-visible:ring-green-500/20",
      dsState === "warning" &&
        "border-yellow-500 focus-visible:ring-yellow-500/20",
      // Design system classes
      showDesignTokens && "ds-debug",
      components.borderRadius && `rounded-[${components.borderRadius}px]`,
      className
    );

    return (
      <div className="w-full">
        <BaseInput
          ref={ref}
          type={type}
          className={enhancedClassName}
          style={dynamicStyles}
          data-ds-variant={dsVariant}
          data-ds-size={dsSize}
          data-ds-state={dsState}
          aria-invalid={dsState === "error" ? "true" : undefined}
          {...props}
        />
        {showValidation && validationMessage && (
          <div
            className={cn(
              "mt-1 text-xs",
              dsState === "error" && "text-destructive",
              dsState === "success" && "text-green-600",
              dsState === "warning" && "text-yellow-600"
            )}
          >
            {validationMessage}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
