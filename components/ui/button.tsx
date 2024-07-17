import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-colors duration-300 ease-linner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black/80 text-white hover:bg-black",
        shadow:
          "bg-neutral-100/60 text-black hover:bg-neutral-100 border border-neutral-200",
        destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        outlineTransparent:
          "border border-slate-200 bg-transparent shadow-sm hover:bg-gray-200/40 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        ghost: "hover:text-slate-900",
        link: "text-slate-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2 h-10",
        sm: "h-8  px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        ghost: "h-10 px-2",
      },
      icon: {
        none: "",
        left: "pr-4 pl-2 py-2 space-x-2",
        right: "pr-2 pl-4 py-2 space-x-2",
        both: "px-4 py-2 space-x-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      icon: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, icon, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
