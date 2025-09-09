"use client";

import { useAtom } from "jotai";
import { accessibilityImprovementsAtom } from "@/atoms/accessibility";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  Info,
  TrendingUp,
  Eye,
  Palette,
  Shield,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AccessibilityImprovement } from "@/lib/color/accessibility-checker";

interface ImprovementCardProps {
  improvement: AccessibilityImprovement;
  onApplyFix?: () => void;
}

function ImprovementCard({ improvement, onApplyFix }: ImprovementCardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="destructive" className="bg-red-600">
            Critical
          </Badge>
        );
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "medium":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "low":
        return <Info className="w-4 h-4 text-gray-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contrast":
        return <TrendingUp className="w-4 h-4" />;
      case "color-blindness":
        return <Eye className="w-4 h-4" />;
      case "usability":
        return <Palette className="w-4 h-4" />;
      case "wcag":
        return <Shield className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          {getPriorityIcon(improvement.priority)}
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{improvement.title}</h4>
              {getPriorityBadge(improvement.priority)}
            </div>
            <p className="text-sm text-muted-foreground">
              {improvement.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          {getTypeIcon(improvement.type)}
          <span className="text-xs capitalize">{improvement.type}</span>
        </div>
      </div>

      {/* Current Issue */}
      <div className="bg-red-50 border border-red-200 rounded p-3">
        <p className="text-sm text-red-800">
          <strong>Issue:</strong> {improvement.currentIssue}
        </p>
      </div>

      {/* Suggested Fix */}
      <div className="bg-green-50 border border-green-200 rounded p-3">
        <p className="text-sm text-green-800">
          <strong>Solution:</strong> {improvement.suggestedFix}
        </p>
      </div>

      {/* Impact */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <p className="text-sm text-blue-800">
          <strong>Impact:</strong> {improvement.impact}
        </p>
      </div>

      {/* Color swatches if available */}
      {improvement.colors && improvement.colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Affected Colors:
          </p>
          <div className="flex gap-1">
            {improvement.colors.map((color, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{color}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      {/* Action button (placeholder for future implementation) */}
      {onApplyFix && (
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onApplyFix}
            className="w-full"
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Apply Suggested Fix
          </Button>
        </div>
      )}
    </div>
  );
}

interface ImprovementGroupProps {
  title: string;
  improvements: AccessibilityImprovement[];
  icon: React.ReactNode;
}

function ImprovementGroup({
  title,
  improvements,
  icon,
}: ImprovementGroupProps) {
  if (improvements.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
        {icon}
        {title} ({improvements.length})
      </h3>
      <div className="space-y-3">
        {improvements.map((improvement, index) => (
          <ImprovementCard key={index} improvement={improvement} />
        ))}
      </div>
    </div>
  );
}

export function ImprovementSuggestions() {
  const [improvements] = useAtom(accessibilityImprovementsAtom);

  const groupedImprovements = {
    critical: improvements.filter((i) => i.priority === "critical"),
    high: improvements.filter((i) => i.priority === "high"),
    medium: improvements.filter((i) => i.priority === "medium"),
    low: improvements.filter((i) => i.priority === "low"),
  };

  const totalImprovements = improvements.length;

  if (totalImprovements === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Accessibility Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-green-800 mb-1">
              Excellent Accessibility!
            </h3>
            <p className="text-sm text-green-600">
              Your color scheme meets all accessibility standards. No
              improvements needed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Accessibility Suggestions
          </CardTitle>
          <Badge variant="outline">
            {totalImprovements} suggestion{totalImprovements > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImprovementGroup
          title="Critical Issues"
          improvements={groupedImprovements.critical}
          icon={<AlertCircle className="w-4 h-4 text-red-600" />}
        />

        <ImprovementGroup
          title="High Priority"
          improvements={groupedImprovements.high}
          icon={<AlertTriangle className="w-4 h-4 text-orange-600" />}
        />

        <ImprovementGroup
          title="Medium Priority"
          improvements={groupedImprovements.medium}
          icon={<Info className="w-4 h-4 text-blue-600" />}
        />

        <ImprovementGroup
          title="Low Priority"
          improvements={groupedImprovements.low}
          icon={<Info className="w-4 h-4 text-gray-600" />}
        />

        {/* Educational note */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Address critical and high priority issues
            first for maximum accessibility impact. These suggestions are
            automatically generated based on WCAG guidelines and color blindness
            research.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
