import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-stroke0 bg-bg2 px-3 py-2 text-sm text-text0 placeholder:text-text2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
