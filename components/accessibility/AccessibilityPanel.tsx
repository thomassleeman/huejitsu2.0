"use client";

import { useAtom } from "jotai";
import { accessibilityStatusAtom } from "@/atoms/accessibility";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  TrendingUp,
  Eye,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

// Import accessibility components
import { ContrastChecker } from "./ContrastChecker";
import { ComplianceIndicators } from "./ComplianceIndicators";
import { ColorBlindnessSimulator } from "./ColorBlindnessSimulator";
import { AccessibilityScore } from "./AccessibilityScore";
import { ImprovementSuggestions } from "./ImprovementSuggestions";
import { AccessibilityStatusIndicator } from "./AccessibilityWarningBadge";

interface AccessibilityPanelProps {
  className?: string;
  variant?: "full" | "compact" | "summary";
}

function AccessibilityQuickSummary() {
  const [status] = useAtom(accessibilityStatusAtom);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusMessage = () => {
    switch (status.overall) {
      case "excellent":
        return "Your color scheme has excellent accessibility";
      case "good":
        return "Your color scheme has good accessibility";
      case "fair":
        return "Your color scheme has moderate accessibility issues";
      case "poor":
        return "Your color scheme has accessibility issues that need attention";
      default:
        return "Analyzing accessibility...";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`text-2xl font-bold ${getScoreColor(status.score)}`}>
          {status.score}
        </div>
        <div>
          <p className="text-sm font-medium">{getStatusMessage()}</p>
          <div className="flex items-center gap-2 mt-1">
            <AccessibilityStatusIndicator />
          </div>
        </div>
      </div>
      <Shield className={`w-6 h-6 ${getScoreColor(status.score)}`} />
    </div>
  );
}

export function AccessibilityPanel({
  className = "",
  variant = "full",
}: AccessibilityPanelProps) {
  const [isExpanded, setIsExpanded] = useState(variant === "full");

  if (variant === "summary") {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AccessibilityQuickSummary />
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={className}>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Accessibility Analysis
                </CardTitle>
                <div className="flex items-center gap-2">
                  <AccessibilityStatusIndicator />
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          {isExpanded && (
            <CollapsibleContent>
              <CardContent className="pt-0">
                <AccessibilityQuickSummary />
                <div className="mt-4">
                  <Tabs defaultValue="score" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="score">Score</TabsTrigger>
                      <TabsTrigger value="suggestions">Issues</TabsTrigger>
                    </TabsList>
                    <TabsContent value="score" className="mt-4">
                      <AccessibilityScore />
                    </TabsContent>
                    <TabsContent value="suggestions" className="mt-4">
                      <ImprovementSuggestions />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </CollapsibleContent>
          )}
        </Collapsible>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Accessibility Analysis
          </CardTitle>
          <AccessibilityStatusIndicator />
        </div>
      </CardHeader>
      <CardContent>
        {/* Quick Summary */}
        <div className="mb-6">
          <AccessibilityQuickSummary />
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="score" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="hidden sm:inline">Score</span>
            </TabsTrigger>
            <TabsTrigger value="contrast" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="hidden sm:inline">Contrast</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">WCAG</span>
            </TabsTrigger>
            <TabsTrigger value="colorblind" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Vision</span>
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              <span className="hidden sm:inline">Improve</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="score">
              <AccessibilityScore />
            </TabsContent>

            <TabsContent value="contrast">
              <ContrastChecker />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceIndicators />
            </TabsContent>

            <TabsContent value="colorblind">
              <ColorBlindnessSimulator />
            </TabsContent>

            <TabsContent value="suggestions">
              <ImprovementSuggestions />
            </TabsContent>
          </div>
        </Tabs>

        {/* Educational Footer */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">About Accessibility</p>
              <p className="text-xs">
                This analysis follows WCAG 2.1 guidelines and color blindness
                research. Accessible design benefits all users, not just those
                with disabilities.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
