import { ReactNode } from "react";
import { KeyboardKey } from "./KeyboardKey";
import { cn } from "@/lib/utils";

interface KeyboardInstructionsProps {
  className?: string;
  position?: "fixed" | "relative";
  children?: ReactNode;
  generateAction?: string;
  navigateAction?: string;
}

export function KeyboardInstructions({
  className,
  position = "fixed",
  children,
  generateAction = "generate variations",
  navigateAction = "navigate history",
}: KeyboardInstructionsProps) {
  return (
    <div
      className={cn(
        "bg-background/95 backdrop-blur-sm border-t border-border text-center py-3 px-4 z-50",
        position === "fixed" && "fixed bottom-0 left-0 right-0",
        position === "relative" && "relative",
        className
      )}
    >
      {children || (
        <p className="text-sm text-muted-foreground">
          Press <KeyboardKey>space</KeyboardKey> to {generateAction} and{" "}
          <KeyboardKey>shift</KeyboardKey> + <KeyboardKey>space</KeyboardKey> to{" "}
          {navigateAction}
        </p>
      )}
    </div>
  );
}

export default KeyboardInstructions;

