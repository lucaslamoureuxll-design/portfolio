import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Couche d'accès au contenu.
 *
 * Tout le contenu éditable vit dans le dossier /content (Markdown, MDX, JSON).
 * Ces fichiers sont modifiés soit à la main, soit via Decap CMS (/admin).
 * Les fonctions sont marquées "use cache" : elles sont exécutées au build
 * et les pages sont pré-rendues en HTML statique.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
};

export type SiteSettings = {
  name: string;
  role: string;
  tagline: string;
  intro: string;
  location?: string;
  available?: boolean;
  email: string;
  avatar?: string;
  resume?: string;
  socials: SocialLinks;
  seo: { title: string; description: string };
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  technologies: string[];
  cover?: string;
  github?: string;
  demo?: string;
  featured: boolean;
  draft: boolean;
  body: string;
};

export type Experience = {
  slug: string;
  kind: "work" | "education";
  role: string;
  organization: string;
  location?: string;
  start: string;
  end?: string;
  technologies: string[];
  body: string;
};

function readDir(dir: string, extensions: string[]) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((file) => extensions.includes(path.extname(file)))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: path.basename(file, path.extname(file)), data, body: content.trim() };
    });
}

/** Normalise une date YAML (Date ou string) en "YYYY-MM" ou "YYYY-MM-DD". */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value ? String(value) : "";
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "settings", "site.json"), "utf8");
  return JSON.parse(raw) as SiteSettings;
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  return readDir("projects", [".md", ".mdx"])
    .map(({ slug, data, body }) => ({
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      date: toDateString(data.date),
      technologies: toStringList(data.technologies),
      cover: data.cover || undefined,
      github: data.github || undefined,
      demo: data.demo || undefined,
      featured: Boolean(data.featured),
      draft: Boolean(data.draft),
      body,
    }))
    .filter((project) => !project.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getProject(slug: string): Promise<Project | undefined> {
  "use cache";
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getExperiences(): Promise<Experience[]> {
  "use cache";
  return readDir("experiences", [".md", ".mdx"])
    .map(({ slug, data, body }) => ({
      slug,
      kind: data.kind === "education" ? ("education" as const) : ("work" as const),
      role: String(data.role ?? ""),
      organization: String(data.organization ?? ""),
      location: data.location || undefined,
      start: toDateString(data.start),
      end: toDateString(data.end) || undefined,
      technologies: toStringList(data.technologies),
      body,
    }))
    .sort((a, b) => {
      // Les postes en cours d'abord, puis par date de début décroissante.
      if (!a.end !== !b.end) return a.end ? 1 : -1;
      return b.start.localeCompare(a.start);
    });
}
