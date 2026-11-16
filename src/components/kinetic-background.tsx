"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import KineticGrid from "@/components/ui/kinetic-grid";

const subscribe = () => () => {};

/**
 * Fond interactif du site : grille cinétique blanche en thème clair, noire en thème sombre.
 * Dessinée en transparence par-dessus les couleurs ambiantes pour garder l'effet « verre ».
 */
export function KineticBackground() {
  const { resolvedTheme } = useTheme();
  // Évite un rendu côté serveur (le thème n'est connu que dans le navigateur).
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!mounted) return null;

  return (
    <KineticGrid
      key={resolvedTheme}
      globalColor={resolvedTheme === "dark" ? "monochrome" : "light"}
      transparent
      className="z-[-1]"
    />
  );
}
