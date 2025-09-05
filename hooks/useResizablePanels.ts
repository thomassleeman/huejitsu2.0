// Custom hook for managing resizable panel state and persistence
// Handles responsive behavior and localStorage persistence

import { useState, useEffect, useCallback } from "react";

interface PanelSizes {
  desktop: number[];
  mobile: number[];
}

const DEFAULT_PANEL_SIZES: PanelSizes = {
  desktop: [50, 50], // 50/50 split on desktop
  mobile: [60, 40], // 60/40 split on mobile (more space for editing)
};

export function useResizablePanels() {
  const [isMobile, setIsMobile] = useState(false);
  const [panelSizes, setPanelSizes] = useState<PanelSizes>(DEFAULT_PANEL_SIZES);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Load panel sizes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("huejitsu-panel-sizes");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPanelSizes({ ...DEFAULT_PANEL_SIZES, ...parsed });
      }
    } catch (error) {
      console.warn("Failed to load panel sizes from localStorage:", error);
    }
  }, []);

  // Save panel sizes to localStorage
  const savePanelSizes = useCallback(
    (sizes: number[], isMobileView: boolean) => {
      const newSizes = {
        ...panelSizes,
        [isMobileView ? "mobile" : "desktop"]: sizes,
      };

      setPanelSizes(newSizes);

      try {
        localStorage.setItem("huejitsu-panel-sizes", JSON.stringify(newSizes));
      } catch (error) {
        console.warn("Failed to save panel sizes to localStorage:", error);
      }
    },
    [panelSizes]
  );

  // Get current panel sizes based on screen size
  const getCurrentSizes = useCallback(() => {
    return isMobile ? panelSizes.mobile : panelSizes.desktop;
  }, [isMobile, panelSizes]);

  // Handle panel resize
  const handlePanelResize = useCallback(
    (sizes: number[]) => {
      savePanelSizes(sizes, isMobile);
    },
    [isMobile, savePanelSizes]
  );

  return {
    isMobile,
    panelSizes: getCurrentSizes(),
    onPanelResize: handlePanelResize,
    resetToDefaults: () => {
      setPanelSizes(DEFAULT_PANEL_SIZES);
      localStorage.removeItem("huejitsu-panel-sizes");
    },
  };
}
