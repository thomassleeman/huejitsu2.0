"use client";

import { useAtom } from "jotai";
import { allContrastRatiosAtom } from "@/atoms/accessibility";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColorPair } from "@/lib/color/accessibility-checker";

interface ContrastIndicatorProps {
  ratio: number;
  isLargeText?: boolean;
}

function ContrastIndicator({
  ratio,
  isLargeText = false,
}: ContrastIndicatorProps) {
  const aaThreshold = isLargeText ? 3.0 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7.0;

  let status: "pass-aaa" | "pass-aa" | "fail";
  let icon: React.ReactNode;
  let color: string;

  if (ratio >= aaaThreshold) {
    status = "pass-aaa";
    icon = <CheckCircle className="w-4 h-4" />;
    color = "text-green-600";
  } else if (ratio >= aaThreshold) {
    status = "pass-aa";
    icon = <AlertCircle className="w-4 h-4" />;
    color = "text-yellow-600";
  } else {
    status = "fail";
    icon = <XCircle className="w-4 h-4" />;
    color = "text-red-600";
  }

  const getStatusText = () => {
    switch (status) {
      case "pass-aaa":
        return "AAA";
      case "pass-aa":
        return "AA";
      case "fail":
        return "Fail";
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "pass-aaa":
        return "Meets WCAG AAA standards - excellent accessibility";
      case "pass-aa":
        return "Meets WCAG AA standards - good accessibility";
      case "fail":
        return "Does not meet WCAG standards - accessibility issues";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 ${color}`}>
            {icon}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getStatusDescription()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ratio: {ratio.toFixed(1)}:1 (min: {aaThreshold}:1)
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ColorPairRowProps {
  pair: ColorPair;
}

function ColorPairRow({ pair }: ColorPairRowProps) {
  const getContextLabel = (context: string) => {
    switch (context) {
      case "normal-text":
        return "Body Text";
      case "large-text":
        return "Large Text";
      case "ui-element":
        return "UI Element";
      default:
        return context;
    }
  };

  const isLargeText = pair.context === "large-text";

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {/* Color samples */}
        <div className="flex">
          <div
            className="w-6 h-6 rounded-l border"
            style={{ backgroundColor: pair.foreground }}
            title={`Foreground: ${pair.foreground}`}
          />
          <div
            className="w-6 h-6 rounded-r border border-l-0"
            style={{ backgroundColor: pair.background }}
            title={`Background: ${pair.background}`}
          />
        </div>

        <div>
          <p className="text-sm font-medium">{getContextLabel(pair.context)}</p>
          <p className="text-xs text-muted-foreground">
            {pair.foreground} on {pair.background}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-mono">{pair.ratio.toFixed(1)}:1</span>
        <ContrastIndicator ratio={pair.ratio} isLargeText={isLargeText} />
      </div>
    </div>
  );
}

export function ContrastChecker() {
  const [contrastRatios] = useAtom(allContrastRatiosAtom);

  const passCount = contrastRatios.filter((pair) => {
    const threshold = pair.context === "large-text" ? 3.0 : 4.5;
    return pair.ratio >= threshold;
  }).length;

  const totalCount = contrastRatios.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Contrast Analysis</CardTitle>
          <Badge variant={passCount === totalCount ? "default" : "destructive"}>
            {passCount}/{totalCount} Pass
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {contrastRatios.map((pair, index) => (
          <ColorPairRow key={index} pair={pair} />
        ))}

        {contrastRatios.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <p>No color pairs to analyze</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
