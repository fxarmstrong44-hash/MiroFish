"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

const directionOffsets = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const offset = directionOffsets[direction];
  const dx = distance !== undefined ? (offset.x > 0 ? distance : offset.x < 0 ? -distance : 0) : offset.x;
  const dy = distance !== undefined ? (offset.y > 0 ? distance : offset.y < 0 ? -distance : 0) : offset.y;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: dx, y: dy }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: dx, y: dy }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
