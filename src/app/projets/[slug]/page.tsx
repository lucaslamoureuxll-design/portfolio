import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, GitHubIcon } from "@/components/icons";
import { GlowPanel } from "@/components/glow-panel";
import { Markdown } from "@/components/markdown";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectCover } from "@/components/project-cover";
import { TechBadge } from "@/components/tech-badge";
import { getProject, getProjects } from "@/lib/content";
import { formatMonth, readingTime } from "@/lib/format";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `/projets/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  // Précédent / suivant dans l'ordre d'affichage des projets.
  const previous = projects[index - 1];
  const next = projects[index + 1];

  return (
    <article className="mx-auto max-w-3xl">
      <div aria-hidden="true" className="reading-progress fixed inset-x-0 top-0 z-50 h-0.5 bg-accent" />

      <Link
        href="/projets"
        className="glass glass-press mb-10 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" /> Tous les projets
      </Link>

      <header>
        <p className="text-sm text-muted">
          {formatMonth(project.date)}
          {project.body && ` · ${readingTime(project.body)} min de lecture`}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{project.title}</h1>
        <p className="mt-4 text-lg text-muted text-pretty">{project.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <TechBadge>{tech}</TechBadge>
            </li>
          ))}
        </ul>

        {(project.demo || project.github) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-press inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-lg shadow-black/15 hover:opacity-90"
              >
                Voir le site <ExternalLinkIcon className="size-4" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
              >
                <GitHubIcon className="size-4" /> Code source
              </a>
            )}
          </div>
        )}
      </header>

      <GlowPanel className="my-10">
        {project.gallery.length > 0 ? (
          <div className="glass-card rounded-[28px] p-2">
            <ProjectGallery images={project.gallery} title={project.title} />
          </div>
        ) : (
          <div className="glass-card relative aspect-[16/9] overflow-hidden rounded-[28px]">
            <ProjectCover title={project.title} cover={project.cover} priority />
          </div>
        )}
      </GlowPanel>

      {project.body && (
        <GlowPanel>
          <div className="glass-card rounded-[28px] p-6 sm:p-10">
            <Markdown source={project.body} />
          </div>
        </GlowPanel>
      )}

      {(previous || next) && (
        <nav aria-label="Autres projets" className="mt-10 grid gap-4 sm:grid-cols-2">
          {previous ? (
            <Link href={`/projets/${previous.slug}`} className="glass glass-press group rounded-3xl p-5">
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeftIcon className="size-3.5 transition group-hover:-translate-x-0.5" /> Projet précédent
              </span>
              <span className="mt-1 block font-medium">{previous.title}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link href={`/projets/${next.slug}`} className="glass glass-press group rounded-3xl p-5 text-right">
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
                Projet suivant <ArrowRightIcon className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
