import type { Metadata } from "next";
import { PageHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { getExperiences, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Parcours",
  description: "Expériences professionnelles et formation.",
};

export default async function ExperiencePage() {
  const [site, experiences] = await Promise.all([getSiteSettings(), getExperiences()]);

  return (
    <>
      <PageHeading eyebrow="Parcours" title="Expériences & formation">
        Les étapes clés de mon parcours.
        {site.resume && (
          <>
            {" "}
            <a href={site.resume} className="text-accent underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
              Télécharger mon CV
            </a>
            .
          </>
        )}
      </PageHeading>
      <div className="glass-card max-w-3xl rounded-[28px] p-6 sm:p-8">
        <Timeline items={experiences} />
      </div>
    </>
  );
}
