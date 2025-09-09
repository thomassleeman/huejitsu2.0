"use client";

import { useAtom } from "jotai";
import {
  wcagAAComplianceAtom,
  wcagAAAComplianceAtom,
} from "@/atoms/accessibility";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComplianceBadgeProps {
  level: "AA" | "AAA";
  passes: number;
  fails: number;
  warnings: number;
  total: number;
}

function ComplianceBadge({
  level,
  passes,
  fails,
  warnings,
  total,
}: ComplianceBadgeProps) {
  const passRate = total > 0 ? (passes / total) * 100 : 0;

  let variant: "default" | "secondary" | "destructive" = "destructive";
  let icon: React.ReactNode = <XCircle className="w-4 h-4" />;
  let status = "Fail";

  if (passRate === 100) {
    variant = "default";
    icon = <CheckCircle className="w-4 h-4" />;
    status = "Pass";
  } else if (passRate >= 80) {
    variant = "secondary";
    icon = <AlertTriangle className="w-4 h-4" />;
    status = "Partial";
  }

  const getDescription = () => {
    const requirements =
      level === "AA"
        ? "4.5:1 for normal text, 3:1 for large text"
        : "7:1 for normal text, 4.5:1 for large text";

    return `WCAG ${level} requires contrast ratios of ${requirements}`;
  };

  const getStatusMessage = () => {
    if (passRate === 100) {
      return `All ${total} color pairs meet WCAG ${level} standards`;
    } else if (passes > 0) {
      return `${passes} of ${total} color pairs meet WCAG ${level} standards`;
    } else {
      return `None of the color pairs meet WCAG ${level} standards`;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className="flex items-center gap-1 px-3 py-1"
          >
            {icon}
            <span>WCAG {level}</span>
            <span className="ml-1">{status}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium">{getStatusMessage()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {getDescription()}
          </p>
          {warnings > 0 && (
            <p className="text-xs text-yellow-400 mt-1">
              {warnings} warnings (meets AA but not AAA)
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ComplianceDetailProps {
  title: string;
  passes: number;
  fails: number;
  warnings?: number;
  total: number;
}

function ComplianceDetail({
  title,
  passes,
  fails,
  warnings = 0,
  total,
}: ComplianceDetailProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>Pass</span>
          </div>
          <span>{passes}</span>
        </div>

        {warnings > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-yellow-600">
              <AlertTriangle className="w-3 h-3" />
              <span>Warning</span>
            </div>
            <span>{warnings}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-red-600">
            <XCircle className="w-3 h-3" />
            <span>Fail</span>
          </div>
          <span>{fails}</span>
        </div>
      </div>
    </div>
  );
}

export function ComplianceIndicators() {
  const [wcagAA] = useAtom(wcagAAComplianceAtom);
  const [wcagAAA] = useAtom(wcagAAAComplianceAtom);

  const aaTotal =
    wcagAA.passes.length + wcagAA.fails.length + wcagAA.warnings.length;
  const aaaTotal =
    wcagAAA.passes.length + wcagAAA.fails.length + wcagAAA.warnings.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-5 h-5" />
          WCAG Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compliance Badges */}
        <div className="flex gap-2 flex-wrap">
          <ComplianceBadge
            level="AA"
            passes={wcagAA.passes.length}
            fails={wcagAA.fails.length}
            warnings={wcagAA.warnings.length}
            total={aaTotal}
          />
          <ComplianceBadge
            level="AAA"
            passes={wcagAAA.passes.length}
            fails={wcagAAA.fails.length}
            warnings={wcagAAA.warnings.length}
            total={aaaTotal}
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
          <ComplianceDetail
            title="WCAG AA (Minimum)"
            passes={wcagAA.passes.length}
            fails={wcagAA.fails.length}
            warnings={wcagAA.warnings.length}
            total={aaTotal}
          />
          <ComplianceDetail
            title="WCAG AAA (Enhanced)"
            passes={wcagAAA.passes.length}
            fails={wcagAAA.fails.length}
            warnings={wcagAAA.warnings.length}
            total={aaaTotal}
          />
        </div>

        {/* Educational Note */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>WCAG AA</strong> is the legal standard in many
            jurisdictions.
            <strong> WCAG AAA</strong> provides enhanced accessibility for users
            with severe visual impairments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
