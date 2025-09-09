"use client";

import { useAtom } from "jotai";
import {
  accessibilityScoreAtom,
  accessibilityStatusAtom,
} from "@/atoms/accessibility";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, TrendingUp, Shield, Eye, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

function ScoreCircle({
  score,
  size = "md",
  showLabel = false,
  label,
}: ScoreCircleProps) {
  const getColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 90) return "stroke-green-600";
    if (score >= 75) return "stroke-blue-600";
    if (score >= 60) return "stroke-yellow-600";
    return "stroke-red-600";
  };

  const sizeMap = {
    sm: { size: 40, stroke: 3, text: "text-xs" },
    md: { size: 60, stroke: 4, text: "text-sm" },
    lg: { size: 80, stroke: 5, text: "text-base" },
  };

  const config = sizeMap[size];
  const radius = (config.size - config.stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg
          width={config.size}
          height={config.size}
          className="transform -rotate-90"
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="transparent"
            className="text-muted-foreground/20"
          />
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${getStrokeColor(
              score
            )} transition-all duration-500 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            config.text
          } font-bold ${getColor(score)}`}
        >
          {score}
        </div>
      </div>
      {showLabel && label && (
        <span className="text-xs text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  );
}

interface ScoreBreakdownProps {
  score: number;
  icon: React.ReactNode;
  label: string;
  description: string;
}

function ScoreBreakdown({
  score,
  icon,
  label,
  description,
}: ScoreBreakdownProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-help">
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={score} className="w-16 h-2" />
              <span className="text-sm font-mono w-8">{score}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AccessibilityScore() {
  const [accessibilityScore] = useAtom(accessibilityScoreAtom);
  const [accessibilityStatus] = useAtom(accessibilityStatusAtom);

  const getRatingBadge = (overall: string) => {
    switch (overall) {
      case "excellent":
        return (
          <Badge variant="default" className="bg-green-600">
            Excellent
          </Badge>
        );
      case "good":
        return (
          <Badge variant="default" className="bg-blue-600">
            Good
          </Badge>
        );
      case "fair":
        return <Badge variant="secondary">Fair</Badge>;
      case "poor":
        return <Badge variant="destructive">Poor</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRatingDescription = (overall: string) => {
    switch (overall) {
      case "excellent":
        return "Your color scheme meets the highest accessibility standards";
      case "good":
        return "Your color scheme has good accessibility with minor areas for improvement";
      case "fair":
        return "Your color scheme has moderate accessibility issues that should be addressed";
      case "poor":
        return "Your color scheme has significant accessibility issues that need attention";
      default:
        return "Accessibility analysis in progress";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Accessibility Score
          </CardTitle>
          {getRatingBadge(accessibilityStatus.overall)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-center">
          <div className="text-center space-y-2">
            <ScoreCircle score={accessibilityStatus.score} size="lg" />
            <p className="text-sm text-muted-foreground max-w-xs">
              {getRatingDescription(accessibilityStatus.overall)}
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Score Breakdown
          </h4>

          <ScoreBreakdown
            score={accessibilityScore.contrast}
            icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
            label="Contrast"
            description="How well your colors meet WCAG contrast ratio requirements for readability"
          />

          <ScoreBreakdown
            score={accessibilityScore.colorBlindness}
            icon={<Eye className="w-4 h-4 text-purple-600" />}
            label="Color Blindness"
            description="How distinguishable your colors are for users with color vision deficiencies"
          />

          <ScoreBreakdown
            score={accessibilityScore.usability}
            icon={<Zap className="w-4 h-4 text-orange-600" />}
            label="Usability"
            description="Overall usability including color variety and semantic appropriateness"
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Detailed Analysis
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <ScoreCircle
                score={accessibilityScore.breakdown.wcagAA}
                size="sm"
                showLabel
                label="WCAG AA"
              />
              <ScoreCircle
                score={accessibilityScore.breakdown.wcagAAA}
                size="sm"
                showLabel
                label="WCAG AAA"
              />
            </div>
            <div className="space-y-2">
              <ScoreCircle
                score={accessibilityScore.breakdown.protanopia}
                size="sm"
                showLabel
                label="Protanopia"
              />
              <ScoreCircle
                score={accessibilityScore.breakdown.deuteranopia}
                size="sm"
                showLabel
                label="Deuteranopia"
              />
              <ScoreCircle
                score={accessibilityScore.breakdown.tritanopia}
                size="sm"
                showLabel
                label="Tritanopia"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {accessibilityStatus.criticalCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {accessibilityStatus.criticalCount} critical issue
                {accessibilityStatus.criticalCount > 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
