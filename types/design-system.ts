// Core design system types based on the blueprint architecture

export interface ColorSystem {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  palette: Record<string, string>;
}

export interface TypographySystem {
  primaryFont: string;
  secondaryFont: string;
  typeScale: {
    h1: { fontSize: string; lineHeight: string };
    h2: { fontSize: string; lineHeight: string };
    h3: { fontSize: string; lineHeight: string };
    h4: { fontSize: string; lineHeight: string };
    h5: { fontSize: string; lineHeight: string };
    h6: { fontSize: string; lineHeight: string };
    body: { fontSize: string; lineHeight: string };
    caption: { fontSize: string; lineHeight: string };
  };
}

export interface SpacingSystem {
  baseUnit: number;
  scale: number[];
  tokens: Record<string, string>;
}

export interface ComponentSystem {
  borderRadius: number;
  borderWidth: number;
  shadowStyle: string;
  opacityLevels: number[];
}

export interface IconSystem {
  library: "lucide" | "heroicons";
  weight: string;
  sizeScale: number[];
}

export interface DesignTokens {
  colors: ColorSystem;
  typography: TypographySystem;
  spacing: SpacingSystem;
  components: ComponentSystem;
  icons: IconSystem;
}

export interface DesignSystem {
  id: string;
  name: string;
  description?: string;
  designTokens: DesignTokens;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export type TabType =
  | "colors"
  | "typography"
  | "spacing"
  | "components"
  | "icons";

export type ExportFormat =
  | "tailwind"
  | "css"
  | "shadcn"
  | "scss"
  | "js"
  | "json"
  | "docs";

export interface ExportOptions {
  format: ExportFormat;
  includeComments?: boolean;
  customPrefix?: string;
  responsive?: boolean;
}

export interface ContrastRatio {
  ratio: number;
  level: "AA" | "AAA" | "fail";
  isLargeText?: boolean;
}

export interface ColorHarmony {
  triadic: string[];
  tetradic: string[];
  complementary: string[];
  analogous: string[];
}
