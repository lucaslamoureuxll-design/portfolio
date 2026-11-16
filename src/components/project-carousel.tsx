"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Project } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from "@/components/icons";
import { GlowPanel } from "@/components/glow-panel";
import { ProjectCover } from "@/components/project-cover";
import { TechBadge } from "@/components/tech-badge";

/**
 * Carrousel : un seul grand projet à la fois.
 * Défilement par flèches, clavier (← →), points de pagination ou glissement (tactile / trackpad).
 */
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = projects.length;

  const goTo = useCallback(
    (target: number) => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const next = (target + count) % count; // boucle aux extrémités
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    },
    [count],
  );

  // Synchronise l'index avec la position de défilement (y compris au glisser).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  }

  if (count === 0) return null;

  const arrowClass =
    "glass glass-press flex size-11 shrink-0 items-center justify-center rounded-full text-foreground disabled:opacity-40";

  return (
    <div role="region" aria-roledescription="carrousel" aria-label="Projets" onKeyDown={onKeyDown} className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <div
            key={project.slug}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${count} : ${project.title}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className="w-full shrink-0 snap-center px-1 py-4"
          >
            <GlowPanel radius={35}>
              <article className="glass-card grid overflow-hidden rounded-[32px] p-2 md:grid-cols-[1.25fr_1fr]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] bg-background/40 md:aspect-auto md:min-h-[380px]">
                  <ProjectCover title={project.title} cover={project.cover} priority={i === 0} />
                </div>

                <div className="flex flex-col p-5 sm:p-8">
                  <p className="text-sm text-muted tabular-nums">
                    <span className="font-medium text-accent">{String(i + 1).padStart(2, "0")}</span> /{" "}
                    {String(count).padStart(2, "0")} · {formatMonth(project.date)}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-muted text-pretty">{project.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <TechBadge>{tech}</TechBadge>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-3 pt-8">
                    <Link
                      href={`/projets/${project.slug}`}
                      className="glass-press inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-lg shadow-black/15 hover:opacity-90"
                    >
                      Voir le projet <ArrowRightIcon className="size-4" />
                    </Link>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                      >
                        Démo <ExternalLinkIcon className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </GlowPanel>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Flèches latérales (écrans larges) */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Projet précédent"
            className={`${arrowClass} absolute top-1/2 -left-5 hidden -translate-y-1/2 lg:flex`}
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Projet suivant"
            className={`${arrowClass} absolute top-1/2 -right-5 hidden -translate-y-1/2 lg:flex`}
          >
            <ArrowRightIcon className="size-5" />
          </button>

          {/* Barre de contrôle : flèches (mobile) + pagination */}
          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Projet précédent"
              className={`${arrowClass} lg:hidden`}
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            <div className="glass flex items-center gap-2 rounded-full px-3 py-2">
              {projects.map((project, i) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Aller au projet ${i + 1} : ${project.title}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-foreground" : "w-2 bg-foreground/25 hover:bg-foreground/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Projet suivant"
              className={`${arrowClass} lg:hidden`}
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        </>
      )}

      <p className="sr-only" aria-live="polite">
        Projet {index + 1} sur {count} : {projects[index]?.title}
      </p>
    </div>
  );
}
