import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface FieldTooltipProps {
  children: ReactNode;
  text: string | ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  contentClassName?: string;
  delayDuration?: number;
}

const FieldTooltip: React.FC<FieldTooltipProps> = ({
  children,
  text,
  variant = "info",
  size = "md",
  className,
  side = "top",
  align = "center",
  sideOffset = 8,
  contentClassName = "max-w-sm",
  delayDuration = 200,
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative", className)}>{children}</div>
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

export default FieldTooltip;
