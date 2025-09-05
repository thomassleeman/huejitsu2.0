// Tab navigation component for design system builder
// Following the blueprint component architecture
// Responsive design with mobile dropdown and right-side positioning

"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import type { TabType } from "@/types/design-system";

interface TabNavigationProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  onTogglePreview: () => void;
  showPreview: boolean;
}

const tabs = [
  { id: "colors" as TabType, label: "Colors" },
  { id: "typography" as TabType, label: "Typography" },
  { id: "spacing" as TabType, label: "Spacing" },
  { id: "components" as TabType, label: "Components" },
  { id: "icons" as TabType, label: "Icons" },
];

export function TabNavigation({
  activeTab,
  onChange,
  onTogglePreview,
  showPreview,
}: TabNavigationProps) {
  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="border-b border-border bg-background px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Desktop Tab Navigation - Hidden on Mobile */}
        <div className="hidden md:block">
          <Tabs
            value={activeTab}
            onValueChange={(value) => onChange(value as TabType)}
          >
            <TabsList
              className="grid w-full grid-cols-5"
              aria-label="Design system navigation"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  aria-label={`Navigate to ${tab.label} section`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Dropdown Navigation - Hidden on Desktop */}
        <div className="md:hidden">
          <Select
            value={activeTab}
            onValueChange={(value) => onChange(value as TabType)}
          >
            <SelectTrigger
              className="w-auto min-w-[140px]"
              aria-label="Design system navigation"
            >
              <SelectValue>{currentTab?.label || "Select Tab"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem
                  key={tab.id}
                  value={tab.id}
                  aria-label={`Navigate to ${tab.label} section`}
                >
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions - Right-aligned for mobile ergonomics */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Preview Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
            className="flex items-center space-x-1 sm:space-x-2"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden sm:inline">Hide Preview</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Show Preview</span>
              </>
            )}
          </Button>

          {/* Export Button */}
          <Button variant="default" size="sm">
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>

          {/* Save Button */}
          <Button variant="outline" size="sm">
            <span className="hidden sm:inline">Save</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
