import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { SocialLinks } from "@/components/social-links";
import { Timeline } from "@/components/timeline";
import { getExperiences, getProjects, getSiteSettings } from "@/lib/content";

export default async function HomePage() {
  const [site, projects, experiences] = await Promise.all([getSiteSettings(), getProjects(), getExperiences()]);
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col-reverse gap-10 pb-20 sm:pb-28 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          {site.available && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Disponible pour de nouveaux projets
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
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition hover:opacity-90"
              >
                Voir mes projets <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 font-medium transition hover:border-foreground"
              >
                Me contacter
              </Link>
            </div>
            <SocialLinks site={site} className="sm:ml-2" />
          </div>
        </div>

        {site.avatar && (
          <div className="relative size-32 shrink-0 overflow-hidden rounded-full border border-border sm:size-44">
            <Image src={site.avatar} alt={site.name} fill priority sizes="176px" className="object-cover" />
          </div>
        )}
      </section>

      {/* Projets mis en avant */}
      <section aria-labelledby="projets-titre" className="pb-20 sm:pb-28">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="projets-titre" className="text-2xl font-semibold tracking-tight">
            Projets sélectionnés
          </h2>
          <Link href="/projets" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
            Tous les projets <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* Aperçu du parcours */}
      {experiences.length > 0 && (
        <section aria-labelledby="parcours-titre">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="parcours-titre" className="text-2xl font-semibold tracking-tight">
              Parcours
            </h2>
            <Link href="/parcours" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
              Tout le parcours <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <Timeline items={experiences.slice(0, 3)} />
        </section>
      )}
    </>
  );
}
