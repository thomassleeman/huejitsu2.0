"use client";

import { useAtom } from "jotai";
import {
  colorWarningsAtom,
  criticalAccessibilityIssuesAtom,
} from "@/atoms/accessibility";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColorSystem } from "@/types/design-system";

interface AccessibilityWarningBadgeProps {
  colorKey: keyof ColorSystem;
  className?: string;
  size?: "sm" | "md";
}

export function AccessibilityWarningBadge({
  colorKey,
  className = "",
  size = "sm",
}: AccessibilityWarningBadgeProps) {
  const [warnings] = useAtom(colorWarningsAtom);
  const [criticalIssues] = useAtom(criticalAccessibilityIssuesAtom);

  // Skip if this key doesn't support warnings
  if (colorKey === "palette") return null;

  const hasWarning = warnings[colorKey];
  if (!hasWarning) return null;

  // Check if any critical issues involve this color
  const hasCriticalIssue = criticalIssues.some((issue) =>
    issue.colors?.some((color) => {
      // This is a simplified check - in a real implementation you'd
      // need to match the actual color values from the atom
      return true; // Placeholder
    })
  );

  const icon = hasCriticalIssue ? (
    <AlertCircle className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
  ) : (
    <AlertTriangle className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
  );

  const variant = hasCriticalIssue ? "destructive" : "secondary";
  const message = hasCriticalIssue
    ? "Critical accessibility issue detected"
    : "Accessibility warning for this color";

  const sizeClasses = size === "sm" ? "h-5 px-1.5 text-xs" : "h-6 px-2 text-xs";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className={`${sizeClasses} flex items-center gap-1 ${className}`}
          >
            {icon}
            {size === "md" && (
              <span>{hasCriticalIssue ? "Critical" : "Warning"}</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Check the Accessibility panel for details
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface AccessibilityStatusIndicatorProps {
  className?: string;
}

export function AccessibilityStatusIndicator({
  className = "",
}: AccessibilityStatusIndicatorProps) {
  const [criticalIssues] = useAtom(criticalAccessibilityIssuesAtom);
  const [warnings] = useAtom(colorWarningsAtom);

  const totalWarnings = Object.values(warnings).filter(Boolean).length;
  const criticalCount = criticalIssues.length;

  if (criticalCount === 0 && totalWarnings === 0) return null;

  const hasCritical = criticalCount > 0;
  const icon = hasCritical ? (
    <AlertCircle className="w-4 h-4" />
  ) : (
    <AlertTriangle className="w-4 h-4" />
  );

  const variant = hasCritical ? "destructive" : "secondary";
  const text = hasCritical
    ? `${criticalCount} Critical`
    : `${totalWarnings} Warning${totalWarnings > 1 ? "s" : ""}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className={`flex items-center gap-1 ${className}`}
          >
            {icon}
            <span>{text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Accessibility Status</p>
            {criticalCount > 0 && (
              <p className="text-xs text-red-200">
                {criticalCount} critical issue{criticalCount > 1 ? "s" : ""}{" "}
                need immediate attention
              </p>
            )}
            {totalWarnings > 0 && (
              <p className="text-xs text-yellow-200">
                {totalWarnings} warning{totalWarnings > 1 ? "s" : ""} detected
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              View the Accessibility panel for full details
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
