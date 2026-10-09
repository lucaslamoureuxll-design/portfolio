import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon, GitHubIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import { ProjectCover } from "@/components/project-cover";
import { TechBadge } from "@/components/tech-badge";
import { getProject, getProjects } from "@/lib/content";
import { formatMonth } from "@/lib/format";

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
    openGraph: { title: project.title, description: project.summary, images: project.cover ? [project.cover] : undefined },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/projets" className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeftIcon className="size-4" /> Tous les projets
      </Link>

      <header>
        <p className="text-sm text-muted">{formatMonth(project.date)}</p>
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
    </article>
  );
}
