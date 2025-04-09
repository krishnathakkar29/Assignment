import type React from "react";

import { useEffect, useRef } from "react";

interface GlowingTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowingText({ children, className = "" }: GlowingTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = textElement.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const centerX = width / 2;
      const centerY = height / 2;

      const distanceFromCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      const maxDistance = Math.sqrt(
        Math.pow(centerX, 2) + Math.pow(centerY, 2)
      );
      const intensity = 1 - Math.min(distanceFromCenter / maxDistance, 1);

      textElement.style.setProperty("--x", `${x}px`);
      textElement.style.setProperty("--y", `${y}px`);
      textElement.style.setProperty("--intensity", intensity.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={textRef}
      className={`relative ${className}`}
      style={{
        textShadow: "0 0 var(--intensity, 0.5) 10px var(--primary)",
        background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), hsl(var(--primary)) 0%, transparent 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        transition: "text-shadow 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
