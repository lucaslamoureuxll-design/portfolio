import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, GitHubIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
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
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  // Les projets sont triés du plus récent au plus ancien.
  const newer = projects[index - 1];
  const older = projects[index + 1];

  return (
    <article className="mx-auto max-w-3xl">
      <div aria-hidden="true" className="reading-progress fixed inset-x-0 top-0 z-50 h-0.5 bg-accent" />

      <Link href="/projets" className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeftIcon className="size-4" /> Tous les projets
      </Link>

      <header>
        <p className="text-sm text-muted">
          {formatMonth(project.date)} · {readingTime(project.body)} min de lecture
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
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Voir le site <ExternalLinkIcon className="size-4" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-foreground"
              >
                <GitHubIcon className="size-4" /> Code source
              </a>
            )}
          </div>
        )}
      </header>

      <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface">
        <ProjectCover title={project.title} cover={project.cover} priority />
      </div>

      <Markdown source={project.body} />

      {(older || newer) && (
        <nav aria-label="Autres projets" className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {older ? (
            <Link href={`/projets/${older.slug}`} className="group rounded-2xl border border-border p-5 transition hover:border-foreground/30">
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeftIcon className="size-3.5 transition group-hover:-translate-x-0.5" /> Projet précédent
              </span>
              <span className="mt-1 block font-medium">{older.title}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {newer && (
            <Link
              href={`/projets/${newer.slug}`}
              className="group rounded-2xl border border-border p-5 text-right transition hover:border-foreground/30"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
                Projet suivant <ArrowRightIcon className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block font-medium">{newer.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
