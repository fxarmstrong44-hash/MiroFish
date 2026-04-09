import { type ReactNode } from "react";

interface GlassmorphismProps {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
  as?: "div" | "section" | "article";
}

const intensityMap = {
  subtle: {
    bg: "rgba(255, 255, 255, 0.03)",
    blur: "blur(8px)",
    border: "rgba(255, 255, 255, 0.06)",
  },
  medium: {
    bg: "rgba(255, 255, 255, 0.08)",
    blur: "blur(16px)",
    border: "rgba(255, 255, 255, 0.15)",
  },
  strong: {
    bg: "rgba(255, 255, 255, 0.12)",
    blur: "blur(24px)",
    border: "rgba(255, 255, 255, 0.2)",
  },
};

export default function Glassmorphism({
  children,
  className = "",
  intensity = "medium",
  as: Component = "div",
}: GlassmorphismProps) {
  const styles = intensityMap[intensity];

  return (
    <Component
      className={`rounded-2xl ${className}`}
      style={{
        background: styles.bg,
        backdropFilter: styles.blur,
        WebkitBackdropFilter: styles.blur,
        border: `1px solid ${styles.border}`,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      {children}
    </Component>
  );
}
