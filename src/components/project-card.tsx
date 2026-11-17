import Link from "next/link";
import type { Project } from "@/lib/content";
import { ProjectCover } from "@/components/project-cover";
import { TechBadge } from "@/components/tech-badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="reveal glass-card group flex h-full flex-col overflow-hidden rounded-[28px] p-2 transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-background/40">
        <ProjectCover title={project.title} cover={project.cover} />
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-3">
        <h3 className="text-lg font-semibold tracking-tight">
          <Link href={`/projets/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted text-pretty">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <TechBadge>{tech}</TechBadge>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
