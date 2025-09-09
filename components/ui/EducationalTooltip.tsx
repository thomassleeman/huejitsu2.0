"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const EducationalTooltipProvider = TooltipPrimitive.Provider;

const EducationalTooltip = TooltipPrimitive.Root;

const EducationalTooltipTrigger = TooltipPrimitive.Trigger;

const EducationalTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    type?: "info" | "warning" | "error";
  }
>(({ className, sideOffset = 4, type = "info", children, ...props }, ref) => {
  const typeStyles = {
    info: "bg-slate-900 text-slate-50 border-slate-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
    error: "bg-red-50 text-red-900 border-red-200",
  };

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-xs rounded-md border px-3 py-2 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        typeStyles[type],
        className
      )}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  );
});
EducationalTooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * Educational tooltip component specifically designed for color theory education
 * Provides rich content with proper styling for disabled options and educational content
 */
interface EducationalTooltipProps {
  children: React.ReactNode;
  content: string;
  title?: string;
  type?: "info" | "warning" | "error";
  disabled?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function EducationalTooltipWrapper({
  children,
  content,
  title,
  type = "info",
  disabled = false,
  side = "bottom",
  align = "center",
}: EducationalTooltipProps) {
  const tooltipType = disabled ? "warning" : type;

  return (
    <EducationalTooltipProvider>
      <EducationalTooltip>
        <EducationalTooltipTrigger asChild>
          {children}
        </EducationalTooltipTrigger>
        <EducationalTooltipContent type={tooltipType} side={side} align={align}>
          <div className="space-y-1">
            {title && (
              <div className="font-semibold text-xs uppercase tracking-wide">
                {title}
              </div>
            )}
            <div className="text-sm leading-relaxed">{content}</div>
            {disabled && (
              <div className="text-xs opacity-75 mt-2 pt-2 border-t border-current/20">
                💡 Try unpinning some colors to enable this option
              </div>
            )}
          </div>
        </EducationalTooltipContent>
      </EducationalTooltip>
    </EducationalTooltipProvider>
  );
}

/**
 * Pre-configured educational tooltip for harmony compatibility
 */
interface HarmonyTooltipProps {
  children: React.ReactNode;
  harmonyType: string;
  isCompatible: boolean;
  tooltip: string;
  incompatibilityReason?: string;
}

export function HarmonyTooltip({
  children,
  harmonyType,
  isCompatible,
  tooltip,
  incompatibilityReason,
}: HarmonyTooltipProps) {
  const content = isCompatible
    ? tooltip
    : incompatibilityReason ||
      `${harmonyType} harmony is not compatible with your pinned colors.`;

  const title = isCompatible ? undefined : "Incompatible";

  return (
    <EducationalTooltipWrapper
      content={content}
      title={title}
      type={isCompatible ? "info" : "warning"}
      disabled={!isCompatible}
    >
      {children}
    </EducationalTooltipWrapper>
  );
}

// Export base components for flexibility
export {
  EducationalTooltip,
  EducationalTooltipTrigger,
  EducationalTooltipContent,
  EducationalTooltipProvider,
};
