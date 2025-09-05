import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KeyboardKeyProps {
  children: ReactNode;
  className?: string;
}

export function KeyboardKey({ children, className }: KeyboardKeyProps) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center outline outline-sky-400/50 rounded border border-gray-400 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm",
        className
      )}
    >
      {children}
    </kbd>
  );
}

export default KeyboardKey;
