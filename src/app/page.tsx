import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { GlowPanel } from "@/components/glow-panel";
import { ProjectCarousel } from "@/components/project-carousel";
import { SocialLinks } from "@/components/social-links";
import { TechBadge } from "@/components/tech-badge";
import { Timeline } from "@/components/timeline";
import { getExperiences, getProjects, getSiteSettings } from "@/lib/content";

export default async function HomePage() {
  const [site, projects, experiences] = await Promise.all([getSiteSettings(), getProjects(), getExperiences()]);
  // Projets mis en avant d'abord, puis les autres (du plus récent au plus ancien).
  const carouselProjects = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col-reverse gap-10 pb-20 sm:pb-28 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          {site.available && (
            <p className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {site.availabilityLabel || "Disponible pour de nouveaux projets"}
            </p>
          )}
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {site.name}
            <span className="block text-muted">{site.role}</span>
          </h1>
          <p className="mt-6 text-xl font-medium text-pretty">{site.tagline}</p>
          <p className="mt-4 text-lg text-muted text-pretty">{site.intro}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projets"
                className="glass-press inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background shadow-lg shadow-black/15 hover:opacity-90"
              >
                Voir mes projets <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="glass glass-press inline-flex items-center rounded-full px-5 py-2.5 font-medium"
              >
                Me contacter
              </Link>
            </div>
            <SocialLinks site={site} showEmail className="sm:ml-2" />
          </div>
        </div>

        {site.avatar && (
          <div className="glass shrink-0 self-start rounded-full p-2 md:self-center">
            <div className="relative size-36 overflow-hidden rounded-full sm:size-48 lg:size-60">
              <Image
                src={site.avatar}
                alt={`Photo de ${site.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 192px, 144px"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* Compétences */}
      {site.skills && site.skills.length > 0 && (
        <section aria-labelledby="competences-titre" className="pb-20 sm:pb-28">
          <h2 id="competences-titre" className="mb-8 text-2xl font-semibold tracking-tight">
            Compétences
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.skills.map((group) => (
              <GlowPanel key={group.category} className="reveal">
                <div className="glass-card h-full rounded-[28px] p-5">
                  <h3 className="text-sm font-medium text-accent">{group.category}</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <li key={skill}>
                        <TechBadge>{skill}</TechBadge>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowPanel>
            ))}
          </div>
        </section>
      )}

      {/* Projets mis en avant */}
      <section aria-labelledby="projets-titre" className="pb-20 sm:pb-28">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="projets-titre" className="text-2xl font-semibold tracking-tight">
            Projets
          </h2>
          <Link
            href="/projets"
            className="glass glass-press inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm text-muted hover:text-foreground"
          >
            Voir tous les projets <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <ProjectCarousel projects={carouselProjects} />
      </section>

      {/* Aperçu du parcours */}
      {experiences.length > 0 && (
        <section aria-labelledby="parcours-titre">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="parcours-titre" className="text-2xl font-semibold tracking-tight">
              Parcours
            </h2>
            <Link
              href="/parcours"
              className="glass glass-press inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm text-muted hover:text-foreground"
            >
              Tout le parcours <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <GlowPanel>
            <div className="glass-card rounded-[28px] p-6 sm:p-8">
              <Timeline items={experiences.slice(0, 3)} />
            </div>
          </GlowPanel>
        </section>
      )}
    </>
  );
}
