"use client";

import { useEffect } from "react";

/**
 * Fait suivre le reflet spéculaire des surfaces en verre au pointeur,
 * en mettant à jour --mx / --my sur l'élément survolé.
 */
export function GlassPointer() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    let frame = 0;
    let current: HTMLElement | null = null;

    function onMove(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = (event.target as Element | null)?.closest<HTMLElement>(".glass, .glass-card");
        if (current && current !== target) {
          current.style.removeProperty("--mx");
          current.style.removeProperty("--my");
        }
        current = target ?? null;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        target.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
