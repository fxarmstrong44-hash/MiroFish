import { type HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type CardVariant = "glass" | "glass-subtle" | "solid" | "gold";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  glass:
    "bg-[rgba(255,255,255,0.08)] backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl",
  "glass-subtle":
    "bg-[rgba(255,255,255,0.03)] backdrop-blur-lg border border-white/6 rounded-xl",
  solid: "bg-[#111118] border border-white/10 rounded-2xl",
  gold: "bg-[rgba(201,168,76,0.05)] border border-[#c9a84c]/15 rounded-2xl",
};

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "glass", padding = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
