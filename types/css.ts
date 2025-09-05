// TypeScript types for CSS custom properties

import { CSSProperties } from "react";

// Extend CSSProperties to include CSS custom properties
export interface CSSCustomProperties extends CSSProperties {
  [key: `--${string}`]: string | number | undefined;
}
