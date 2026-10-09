import { getProject, getProjects, getSiteSettings } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Projet";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [site, project] = await Promise.all([getSiteSettings(), getProject(slug)]);
  return renderOgImage({
    eyebrow: `Projet · ${site.name}`,
    title: project?.title ?? site.name,
    subtitle: project?.summary ?? site.tagline,
    footer: project?.technologies.join("  ·  ") ?? site.role,
  });
}
