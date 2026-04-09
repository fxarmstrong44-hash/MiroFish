import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle" | "chart";
}

export default function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const base = "animate-pulse bg-white/[0.06] rounded";

  if (variant === "card") {
    return (
      <div className={clsx("glass p-5 space-y-4", className)}>
        <div className={clsx(base, "h-4 w-1/3 rounded-md")} />
        <div className={clsx(base, "h-8 w-2/3 rounded-md")} />
        <div className={clsx(base, "h-3 w-full rounded-md")} />
        <div className={clsx(base, "h-3 w-4/5 rounded-md")} />
      </div>
    );
  }

  if (variant === "circle") {
    return <div className={clsx(base, "rounded-full w-10 h-10", className)} />;
  }

  if (variant === "chart") {
    return (
      <div className={clsx("glass p-5 space-y-4", className)}>
        <div className="flex justify-between">
          <div className={clsx(base, "h-6 w-20 rounded-md")} />
          <div className={clsx(base, "h-6 w-24 rounded-md")} />
        </div>
        <div className={clsx(base, "h-48 w-full rounded-lg")} />
      </div>
    );
  }

  return <div className={clsx(base, "h-4 rounded-md", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton variant="chart" />
        <Skeleton variant="card" className="h-64" />
      </div>
    </div>
  );
}
