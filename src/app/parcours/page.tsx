import type { Metadata } from "next";
import { GlowPanel } from "@/components/glow-panel";
import { ResumeCard } from "@/components/resume-card";
import { PageHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { getExperiences, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Parcours",
  description: "Parcours et formation de Lucas Lamoureux : BUT MMI, baccalauréat technologique, brevet.",
  alternates: { canonical: "/parcours" },
};

export default async function ExperiencePage() {
  const [site, experiences] = await Promise.all([getSiteSettings(), getExperiences()]);

  return (
    <>
      <PageHeading eyebrow="Parcours" title="Expériences & formation">
        Les étapes clés de mon parcours.
      </PageHeading>
      <GlowPanel className="max-w-3xl">
        <div className="glass-card rounded-[28px] p-6 sm:p-8">
          <Timeline items={experiences} />
        </div>
      </GlowPanel>
      {site.resume && (
        <section id="cv" aria-label="Mon CV" className="mt-10 max-w-3xl scroll-mt-28">
          <ResumeCard site={site} />
        </section>
      )}
    </>
  );
}
