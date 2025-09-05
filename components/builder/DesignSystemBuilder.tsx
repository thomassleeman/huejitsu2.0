// Main design system builder container
// Following the blueprint and state.md architecture

"use client";

import { useState } from "react";
import { Provider } from "jotai";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import type { TabType } from "@/types/design-system";
import { TabNavigation } from "@/components/builder/TabNavigation";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { useResizablePanels } from "@/hooks/useResizablePanels";

// Import tab components
import { ColorTab } from "./color/ColorTab";
import { TypographyTab } from "./typography/TypographyTab";
import { SpacingTab } from "./spacing/SpacingTab";
import { ComponentsTab } from "./components/ComponentsTab";
import { IconsTab } from "./icons/IconsTab";

interface DesignSystemBuilderProps {
  initialSystemId?: string;
}

export function DesignSystemBuilder({}: DesignSystemBuilderProps) {
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [showPreview, setShowPreview] = useState(true);

  const { isMobile, panelSizes, onPanelResize } = useResizablePanels();

  const renderTabContent = () => {
    switch (activeTab) {
      case "colors":
        return <ColorTab />;
      case "typography":
        return <TypographyTab />;
      case "spacing":
        return <SpacingTab />;
      case "components":
        return <ComponentsTab />;
      case "icons":
        return <IconsTab />;
      default:
        return null;
    }
  };

  return (
    <Provider>
      <div className="h-full flex flex-col container-responsive">
        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onChange={setActiveTab}
          onTogglePreview={() => setShowPreview(!showPreview)}
          showPreview={showPreview}
        />

        {/* Main Content Area with Responsive Panels */}
        <div className="flex-1 min-h-0">
          {showPreview ? (
            <PanelGroup
              direction={isMobile ? "vertical" : "horizontal"}
              className="h-full"
              onLayout={onPanelResize}
            >
              {/* Tab Content Panel */}
              <Panel
                defaultSize={panelSizes[0]}
                minSize={isMobile ? 30 : 20}
                maxSize={isMobile ? 80 : 80}
                className={isMobile ? "min-h-0" : "min-w-0"}
              >
                <div className="h-full overflow-auto p-1">
                  {renderTabContent()}
                </div>
              </Panel>

              {/* Resizable Handle */}
              <PanelResizeHandle
                className={`${
                  isMobile
                    ? "h-2 bg-border hover:bg-border/80 cursor-row-resize"
                    : "w-2 bg-border hover:bg-border/80 cursor-col-resize"
                } transition-colors duration-200 group relative flex-shrink-0`}
              >
                {/* Visual indicator for better UX */}
                <div
                  className={`${
                    isMobile
                      ? "absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-1 bg-border/60 group-hover:bg-border mx-2 rounded-full"
                      : "absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-border/60 group-hover:bg-border my-2 rounded-full"
                  } transition-colors duration-200`}
                />
              </PanelResizeHandle>

              {/* Preview Panel */}
              <Panel
                defaultSize={panelSizes[1]}
                minSize={isMobile ? 20 : 20}
                maxSize={isMobile ? 70 : 80}
                className={isMobile ? "min-h-0" : "min-w-0"}
              >
                <PreviewPanel />
              </Panel>
            </PanelGroup>
          ) : (
            /* Full-width content when preview is hidden */
            <div className="h-full overflow-auto p-1">{renderTabContent()}</div>
          )}
        </div>
      </div>
    </Provider>
  );
}
