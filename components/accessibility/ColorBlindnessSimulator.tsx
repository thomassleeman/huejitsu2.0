"use client";

import { useAtom } from "jotai";
import { colorsAtom } from "@/atoms/design-system";
import { colorBlindnessReportAtom } from "@/atoms/accessibility";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import chroma from "chroma-js";

interface ColorSimulationProps {
  color: string;
  type: "protanopia" | "deuteranopia" | "tritanopia";
  size?: "sm" | "md" | "lg";
}

function simulateColorBlindness(
  color: string,
  type: "protanopia" | "deuteranopia" | "tritanopia"
): string {
  try {
    const [r, g, b] = chroma(color).rgb();

    let newR: number, newG: number, newB: number;

    switch (type) {
      case "protanopia": // Red blindness
        newR = 0.567 * r + 0.433 * g;
        newG = 0.558 * r + 0.442 * g;
        newB = 0.242 * g + 0.758 * b;
        break;
      case "deuteranopia": // Green blindness
        newR = 0.625 * r + 0.375 * g;
        newG = 0.7 * r + 0.3 * g;
        newB = 0.3 * g + 0.7 * b;
        break;
      case "tritanopia": // Blue blindness
        newR = 0.95 * r + 0.05 * g;
        newG = 0.433 * g + 0.567 * b;
        newB = 0.475 * g + 0.525 * b;
        break;
      default:
        return color;
    }

    return chroma
      .rgb(
        Math.max(0, Math.min(255, newR)),
        Math.max(0, Math.min(255, newG)),
        Math.max(0, Math.min(255, newB))
      )
      .hex();
  } catch (error) {
    console.warn(`Error simulating ${type} for color ${color}:`, error);
    return color;
  }
}

function ColorSimulation({ color, type, size = "md" }: ColorSimulationProps) {
  const simulatedColor = simulateColorBlindness(color, type);
  const isChanged = simulatedColor.toLowerCase() !== color.toLowerCase();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`${sizeClasses[size]} rounded border relative overflow-hidden`}
          >
            <div
              className="w-full h-full"
              style={{ backgroundColor: simulatedColor }}
            />
            {isChanged && (
              <div className="absolute inset-0 border border-yellow-400 border-dashed" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="text-xs font-medium">
              {type.charAt(0).toUpperCase() + type.slice(1)} Simulation
            </p>
            <p className="text-xs">Original: {color}</p>
            <p className="text-xs">Simulated: {simulatedColor}</p>
            {isChanged && (
              <p className="text-xs text-yellow-400">Color appears different</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface VisionTypeCardProps {
  type: "protanopia" | "deuteranopia" | "tritanopia";
  severity: "none" | "minor" | "major" | "severe";
  issues: string[];
  colors: string[];
}

function VisionTypeCard({
  type,
  severity,
  issues,
  colors,
}: VisionTypeCardProps) {
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "protanopia":
        return {
          name: "Protanopia",
          description: "Red color blindness",
          prevalence: "~1% of males",
          details: "Difficulty distinguishing red from green",
        };
      case "deuteranopia":
        return {
          name: "Deuteranopia",
          description: "Green color blindness",
          prevalence: "~6% of males",
          details: "Most common form of color blindness",
        };
      case "tritanopia":
        return {
          name: "Tritanopia",
          description: "Blue color blindness",
          prevalence: "~0.1% of people",
          details: "Difficulty distinguishing blue from yellow",
        };
      default:
        return {
          name: type,
          description: "",
          prevalence: "",
          details: "",
        };
    }
  };

  const typeInfo = getTypeInfo(type);

  const getSeverityBadge = () => {
    switch (severity) {
      case "none":
        return (
          <Badge variant="default" className="text-xs">
            No Issues
          </Badge>
        );
      case "minor":
        return (
          <Badge variant="secondary" className="text-xs">
            Minor Issues
          </Badge>
        );
      case "major":
        return (
          <Badge variant="destructive" className="text-xs">
            Major Issues
          </Badge>
        );
      case "severe":
        return (
          <Badge variant="destructive" className="text-xs">
            Severe Issues
          </Badge>
        );
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case "none":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "minor":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "major":
      case "severe":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getSeverityIcon()}
            <h4 className="font-medium">{typeInfo.name}</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {typeInfo.description}
          </p>
          <p className="text-xs text-muted-foreground">{typeInfo.prevalence}</p>
        </div>
        {getSeverityBadge()}
      </div>

      {/* Color simulations */}
      <div className="space-y-2">
        <p className="text-xs font-medium">Color Appearance:</p>
        <div className="flex gap-2">
          {colors.slice(0, 4).map((color, index) => (
            <div key={index} className="space-y-1">
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: color }}
                title={`Original: ${color}`}
              />
              <ColorSimulation color={color} type={type} size="lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && severity !== "none" && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Issues:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {issues.slice(0, 3).map((issue, index) => (
              <li key={index} className="flex items-start gap-1">
                <span>•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ColorBlindnessSimulator() {
  const [colors] = useAtom(colorsAtom);
  const [colorBlindnessReport] = useAtom(colorBlindnessReportAtom);

  const colorArray = [
    colors.primary,
    colors.secondary,
    colors.accent,
    colors.background,
    colors.text,
  ];

  const getOverallSeverity = () => {
    const severities = [
      colorBlindnessReport.protanopia.severity,
      colorBlindnessReport.deuteranopia.severity,
      colorBlindnessReport.tritanopia.severity,
    ];

    if (severities.includes("severe")) return "severe";
    if (severities.includes("major")) return "major";
    if (severities.includes("minor")) return "minor";
    return "none";
  };

  const overallSeverity = getOverallSeverity();
  const issueCount = [
    colorBlindnessReport.protanopia,
    colorBlindnessReport.deuteranopia,
    colorBlindnessReport.tritanopia,
  ].filter((report) => report.severity !== "none").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Color Blindness Simulation
          </CardTitle>
          <Badge
            variant={overallSeverity === "none" ? "default" : "destructive"}
            className="text-xs"
          >
            {issueCount === 0
              ? "All Clear"
              : `${issueCount} Issue${issueCount > 1 ? "s" : ""}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <VisionTypeCard
            type="protanopia"
            severity={colorBlindnessReport.protanopia.severity}
            issues={colorBlindnessReport.protanopia.issues}
            colors={colorArray}
          />
          <VisionTypeCard
            type="deuteranopia"
            severity={colorBlindnessReport.deuteranopia.severity}
            issues={colorBlindnessReport.deuteranopia.issues}
            colors={colorArray}
          />
          <VisionTypeCard
            type="tritanopia"
            severity={colorBlindnessReport.tritanopia.severity}
            issues={colorBlindnessReport.tritanopia.issues}
            colors={colorArray}
          />
        </div>

        {/* Educational note */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Color blindness affects approximately 8% of men and 0.5% of women
            worldwide. These simulations show how your colors appear to users
            with different types of color vision deficiency.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
