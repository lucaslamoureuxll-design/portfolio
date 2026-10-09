"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Changer de thème"
      title="Changer de thème"
      className="flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-foreground/5 hover:text-foreground"
    >
      {/* Les deux icônes sont rendues, le CSS choisit : pas de décalage à l'hydratation. */}
      <SunIcon className="hidden size-[18px] dark:block" />
      <MoonIcon className="size-[18px] dark:hidden" />
    </button>
  );
}
