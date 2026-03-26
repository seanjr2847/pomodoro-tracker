"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: "slide-up-fade" | "fade-in" | "scale-fade";
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
      className={cn(visible ? `animate-${animation}` : "opacity-0", className)}
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
