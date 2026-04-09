"use client";

import { useEffect, useRef } from "react";

interface CursorGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
}

export default function CursorGlow({
  color = "201, 168, 76",
  size = 600,
  opacity = 0.08,
}: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
      glowRef.current.style.opacity = "1";
    }

    function handleMouseLeave() {
      if (!glowRef.current) return;
      glowRef.current.style.opacity = "0";
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, transparent 70%)`,
      }}
    />
  );
}
