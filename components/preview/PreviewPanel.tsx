// Live preview panel component
// Shows real-time updates as design system changes

"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { previewCSSAtom } from "@/atoms/design-system";
import { ComponentShowcase } from "./ComponentShowcase";

export function PreviewPanel() {
  const cssVars = useAtomValue(previewCSSAtom);

  // Inject CSS variables into the document root for live preview
  useEffect(() => {
    const root = document.documentElement;

    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Cleanup function to remove variables on unmount
    return () => {
      Object.keys(cssVars).forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, [cssVars]);

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
          <p className="text-sm text-foreground/60">
            See your design system in action with real components
          </p>
        </div>

        <ComponentShowcase />
      </div>
    </div>
  );
}
