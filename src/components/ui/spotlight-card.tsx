"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
  /** Rayon des coins de la lueur, en pixels (à aligner sur celui de la carte). */
  radius?: number;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

/**
 * Carte à lueur « projecteur » : un halo coloré suit le pointeur sur la bordure et le fond.
 * Les styles des pseudo-éléments [data-glow] sont dans globals.css (chargés une seule fois).
 */
const GlowCard = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
  radius = 14,
}: GlowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      const card = cardRef.current;
      if (!card) return;
      card.style.setProperty("--x", x.toFixed(2));
      card.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
      card.style.setProperty("--y", y.toFixed(2));
      card.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
    };

    document.addEventListener("pointermove", syncPointer, { passive: true });
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const style = {
    "--base": base,
    "--spread": spread,
    "--radius": String(radius),
    "--border": "3",
    "--backdrop": "hsl(0 0% 60% / 0.12)",
    "--backup-border": "var(--backdrop)",
    "--size": "200",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 150) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
    )`,
    backgroundColor: "var(--backdrop, transparent)",
    backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    backgroundAttachment: "fixed",
    border: "var(--border-size) solid var(--backup-border)",
    borderRadius: `${radius}px`,
    position: "relative",
    ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === "number" ? `${height}px` : height }),
  } as CSSProperties;

  return (
    <div
      ref={cardRef}
      data-glow
      style={style}
      className={cn(
        "relative grid grid-rows-[1fr_auto] gap-4 p-4 shadow-[0_1rem_2rem_-1rem_black]",
        !customSize && [sizeMap[size], "aspect-[3/4]"],
        className,
      )}
    >
      <div data-glow aria-hidden="true" />
      {children}
    </div>
  );
};

export { GlowCard };
