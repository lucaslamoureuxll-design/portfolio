import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const projects = await getProjects();
  return [
    ...["", "/projets", "/parcours", "/contact"].map((path) => ({ url: `${base}${path}` })),
    ...projects.map((project) => ({ url: `${base}/projets/${project.slug}`, lastModified: project.date })),
  ];
}
