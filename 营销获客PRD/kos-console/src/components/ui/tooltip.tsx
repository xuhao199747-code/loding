import * as TooltipPrimitive from "@radix-ui/react-tooltip";
export const TooltipProvider = TooltipPrimitive.Provider; export const Tooltip = TooltipPrimitive.Root; export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = ({ className, sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) => <TooltipPrimitive.Portal><TooltipPrimitive.Content sideOffset={sideOffset} className={className || "z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"} {...props} /></TooltipPrimitive.Portal>;
