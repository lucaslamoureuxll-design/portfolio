import Image from "next/image";
import type { SiteSettings } from "@/lib/content";
import { DownloadIcon, EyeIcon } from "@/components/icons";

/** Carte « Mon CV » : aperçu cliquable, bouton pour l'ouvrir et bouton pour le télécharger. */
export function ResumeCard({ site }: { site: SiteSettings }) {
  if (!site.resume) return null;
  const fileName = `CV-${site.name.replace(/\s+/g, "-")}.pdf`;

  return (
    <div className="glass-card grid items-center gap-6 rounded-[28px] p-5 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-6">
      {site.resumePreview && (
        <a
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ouvrir mon CV dans un nouvel onglet"
          className="group relative mx-auto block aspect-[595/842] w-40 overflow-hidden rounded-xl border border-black/[0.08] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 sm:w-44 dark:border-white/10"
        >
          <Image
            src={site.resumePreview}
            alt={`Aperçu du CV de ${site.name}`}
            fill
            sizes="176px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </a>
      )}
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-semibold tracking-tight">Mon CV</h3>
        <p className="mt-2 text-muted text-pretty">
          Formation, expériences et compétences : tout mon parcours sur une page.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-press inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-lg shadow-black/15 hover:opacity-90"
          >
            <EyeIcon className="size-4" /> Voir mon CV
          </a>
          <a
            href={site.resume}
            download={fileName}
            className="glass glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            <DownloadIcon className="size-4" /> Télécharger (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
