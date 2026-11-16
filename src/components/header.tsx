"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { OPEN_PALETTE_EVENT } from "@/components/command-palette";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets" },
  { href: "/parcours", label: "Parcours" },
  { href: "/contact", label: "Contact" },
];

function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      aria-label="Recherche rapide (Ctrl + K)"
      title="Recherche rapide (Ctrl + K)"
      className="glass-press flex h-9 items-center gap-2 rounded-full px-2.5 text-muted hover:bg-foreground/[0.06] hover:text-foreground"
    >
      <SearchIcon className="size-[18px]" />
      <kbd className="hidden rounded border border-border px-1.5 font-sans text-[11px] lg:inline">⌘K</kbd>
    </button>
  );
}

export function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="glass mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full pr-2 pl-5">
        <Link href="/" className="font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {name}
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`glass-press rounded-full px-3.5 py-1.5 text-sm ${
                isActive(item.href)
                  ? "bg-white/70 font-medium text-foreground shadow-sm ring-1 ring-black/5 dark:bg-white/15 dark:ring-white/10"
                  : "text-muted hover:bg-foreground/[0.06] hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <SearchButton />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <SearchButton />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="glass-press flex size-9 items-center justify-center rounded-full text-muted hover:bg-foreground/[0.06] hover:text-foreground"
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Navigation mobile" className="glass mx-auto mt-2 max-w-5xl rounded-3xl md:hidden">
          <ul className="flex flex-col p-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-2xl px-4 py-3 ${
                    isActive(item.href) ? "bg-white/60 font-medium text-foreground dark:bg-white/10" : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
