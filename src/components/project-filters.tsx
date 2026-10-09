"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";

const ALL = "Tous";

export function ProjectFilters({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(ALL);

  // Technologies triées par nombre d'occurrences, puis alphabétiquement.
  const technologies = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tech of project.technologies) counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
      .map(([tech]) => tech);
  }, [projects]);

  const visible = active === ALL ? projects : projects.filter((p) => p.technologies.includes(active));

  return (
    <div>
      <div role="group" aria-label="Filtrer par technologie" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {[ALL, ...technologies].map((tech) => {
          const selected = tech === active;
          return (
            <button
              key={tech}
              type="button"
              onClick={() => setActive(tech)}
              aria-pressed={selected}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition ${
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {tech}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} projet{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}
      </p>

      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-muted">Aucun projet pour cette technologie.</p>
      )}
    </div>
  );
}
