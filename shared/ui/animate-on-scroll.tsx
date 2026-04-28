"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

const animationClasses = {
  "slide-up-fade": "animate-slide-up-fade",
  "fade-in": "animate-fade-in",
  "scale-fade": "animate-scale-fade",
} as const;

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: keyof typeof animationClasses;
  delay?: number;
  threshold?: number;
}

export function AnimateOnScroll({
  children,
  className,
  animation = "slide-up-fade",
  delay = 0,
  threshold = 0.15,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(visible ? animationClasses[animation] : "opacity-0", className)}
      style={
        visible && delay > 0
          ? { animationDelay: `${delay}ms`, animationFillMode: "both" }
          : visible
            ? { animationFillMode: "both" }
            : undefined
      }
    >
      {children}
    </div>
  );
}
