import type { ReactNode } from "react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

/**
 * Cadre lumineux qui suit le curseur, placé derrière une carte en verre.
 * Les réglages communs à tout le site sont ici (couleur, rayon, pas de flou
 * — un flou sur le cadre empêcherait la carte en verre de voir le fond coloré).
 */
export function GlowPanel({
  children,
  className,
  radius = 31,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  return (
    <GlowCard customSize glowColor="blue" radius={radius} className={cn("block gap-0 p-0 shadow-none", className)}>
      {children}
    </GlowCard>
  );
}
