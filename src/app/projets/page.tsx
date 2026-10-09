import type { Metadata } from "next";
import { ProjectFilters } from "@/components/project-filters";
import { PageHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projets",
  description: "Sélection de projets personnels et professionnels.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeading eyebrow="Projets" title="Ce que j'ai construit">
        Une sélection de projets personnels et professionnels. Filtrez par technologie pour explorer.
      </PageHeading>
      <ProjectFilters projects={projects} />
    </>
  );
}
