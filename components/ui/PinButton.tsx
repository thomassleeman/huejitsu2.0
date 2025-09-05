import { Button } from "./button";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinButtonProps {
  isPinned: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "secondary";
  disabled?: boolean;
  label?: string;
}

export function PinButton({
  isPinned,
  onToggle,
  className,
  size = "sm",
  variant = "ghost",
  disabled = false,
  label,
}: PinButtonProps) {
  const Icon = isPinned ? Pin : PinOff;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "transition-colors",
        isPinned && "bg-primary/10 text-primary hover:bg-primary/20",
        className
      )}
      title={isPinned ? "Unpin to allow changes" : "Pin to lock current value"}
    >
      <Icon className="h-3 w-3" />
      {label && <span className="ml-1">{label}</span>}
    </Button>
  );
}

export default PinButton;

