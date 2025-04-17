import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import * as React from "react";

const TooltipProvider = ({
  children,
  delayDuration = 300,
  ...props
}: TooltipPrimitive.TooltipProviderProps) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props}>
    {children}
  </TooltipPrimitive.Provider>
);

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "info" | "success" | "warning" | "error";
  }
>(
  (
    { className, sideOffset = 4, size = "md", variant = "default", ...props },
    ref
  ) => {
    const variantClasses = {
      default:
        "bg-app-dark-card border border-app-dark-border text-app-active-text",
      info: "bg-blue-950 border border-blue-800 text-blue-100",
      success: "bg-green-950 border border-green-800 text-green-100",
      warning: "bg-amber-950 border border-amber-800 text-amber-100",
      error: "bg-red-950 border border-red-800 text-red-100",
    };

    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    return (
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md shadow-lg",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
        asChild
      >
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.5,
          }}
        >
          {props.children}
          <TooltipPrimitive.Arrow
            className={cn(
              "fill-current",
              variant === "default"
                ? "text-app-dark-border"
                : variant === "info"
                ? "text-blue-800"
                : variant === "success"
                ? "text-green-800"
                : variant === "warning"
                ? "text-amber-800"
                : "text-red-800"
            )}
            width={10}
            height={5}
          />
        </motion.div>
      </TooltipPrimitive.Content>
    );
  }
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
