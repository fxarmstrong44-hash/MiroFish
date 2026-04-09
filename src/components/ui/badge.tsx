import { clsx } from "clsx";
import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "gold" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white/60",
  success: "bg-emerald-400/10 text-emerald-400",
  warning: "bg-yellow-400/10 text-yellow-400",
  danger: "bg-red-400/10 text-red-400",
  gold: "bg-[#c9a84c]/10 text-[#c9a84c]",
  info: "bg-blue-400/10 text-blue-400",
};

export default function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
