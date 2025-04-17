import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
} from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type TooltipVariant = "default" | "info" | "success" | "warning" | "error";
type TooltipSize = "sm" | "md" | "lg";

interface HelpTooltipProps {
  text: string;
  variant?: TooltipVariant;
  size?: TooltipSize;
  iconSize?: number;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  iconClassName?: string;
  contentClassName?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  text,
  variant = "default",
  size = "md",
  iconSize = 16,
  className,
  side = "top",
  align = "center",
  sideOffset = 8,
  iconClassName,
  contentClassName = "max-w-sm",
}) => {
  // Select icon based on variant
  const IconComponent = {
    default: HelpCircle,
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  }[variant];

  // Icon color class based on variant
  const iconColorClass = {
    default: "text-app-inactive-text",
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
  }[variant];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex cursor-help", className)}>
            <IconComponent
              size={iconSize}
              className={cn(
                iconColorClass,
                "hover:opacity-80 transition-opacity",
                iconClassName
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent
          variant={variant}
          size={size}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={contentClassName}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
