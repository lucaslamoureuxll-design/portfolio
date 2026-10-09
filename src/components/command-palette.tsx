"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { SearchIcon } from "@/components/icons";

export const OPEN_PALETTE_EVENT = "open-command-palette";

export type PaletteProject = { slug: string; title: string; technologies: string[] };

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
};

/** Normalise pour une recherche insensible à la casse et aux accents. */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function CommandPalette({
  projects,
  email,
  linkedin,
}: {
  projects: PaletteProject[];
  email: string;
  linkedin?: string;
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const openRef = useRef(false);

  // Ouverture : ⌘K / Ctrl+K, « / », ou événement envoyé par le bouton du header.
  useEffect(() => {
    function show() {
      setQuery("");
      setActive(0);
      setNotice("");
      setOpen(true);
    }
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (openRef.current) setOpen(false);
        else show();
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        show();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      router.push(href);
    };
    const list: Command[] = [
      { id: "home", group: "Navigation", label: "Accueil", run: go("/") },
      { id: "projects", group: "Navigation", label: "Projets", run: go("/projets") },
      { id: "path", group: "Navigation", label: "Parcours", keywords: "formation experience cv", run: go("/parcours") },
      { id: "contact", group: "Navigation", label: "Contact", keywords: "message formulaire", run: go("/contact") },
      ...projects.map((project) => ({
        id: `project-${project.slug}`,
        group: "Projets",
        label: project.title,
        hint: project.technologies.slice(0, 3).join(" · "),
        keywords: project.technologies.join(" "),
        run: go(`/projets/${project.slug}`),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copier mon adresse e-mail",
        hint: email,
        keywords: "mail courriel",
        run: () => {
          navigator.clipboard.writeText(email).then(
            () => setNotice("Adresse e-mail copiée !"),
            () => (window.location.href = `mailto:${email}`),
          );
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: resolvedTheme === "dark" ? "Passer en thème clair" : "Passer en thème sombre",
        keywords: "theme mode sombre clair dark light",
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          setOpen(false);
        },
      },
    ];
    if (linkedin) {
      list.push({
        id: "linkedin",
        group: "Actions",
        label: "Ouvrir mon profil LinkedIn",
        keywords: "reseau social",
        run: () => {
          setOpen(false);
          window.open(linkedin, "_blank", "noopener,noreferrer");
        },
      });
    }
    return list;
  }, [projects, email, linkedin, resolvedTheme, router, setTheme]);

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return commands;
    return commands.filter((command) => {
      const haystack = normalize(`${command.label} ${command.keywords ?? ""} ${command.group}`);
      return terms.every((term) => haystack.includes(term));
    });
  }, [commands, query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      results[active]?.run();
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div className="palette-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche rapide"
        className="palette-panel relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchIcon className="size-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Rechercher une page, un projet, une technologie…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
          <kbd className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-xs text-muted sm:block">Échap</kbd>
        </div>

        <ul ref={listRef} id="palette-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">Aucun résultat pour « {query} »</li>}
          {results.map((command, index) => {
            const header = command.group !== lastGroup ? command.group : null;
            lastGroup = command.group;
            return (
              <li key={command.id} role="presentation">
                {header && <p className="px-3 pt-3 pb-1.5 text-xs font-medium text-muted">{header}</p>}
                <div
                  id={`palette-${command.id}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  onMouseMove={() => setActive(index)}
                  onClick={() => command.run()}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm ${
                    index === active ? "bg-foreground/[0.06] text-foreground" : "text-foreground/90"
                  }`}
                >
                  <span className="truncate">{command.label}</span>
                  {command.hint && <span className="shrink-0 truncate text-xs text-muted">{command.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted">
          <span aria-live="polite" className={notice ? "font-medium text-emerald-600 dark:text-emerald-400" : ""}>
            {notice || "↑↓ pour naviguer · Entrée pour valider"}
          </span>
          <span className="hidden sm:inline">⌘K / Ctrl K</span>
        </div>
      </div>
    </div>
  );
}
