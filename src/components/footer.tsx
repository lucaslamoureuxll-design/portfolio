import type { SiteSettings } from "@/lib/content";
import { SocialLinks } from "@/components/social-links";

export function Footer({ site }: { site: SiteSettings }) {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © {site.name}. Construit avec Next.js &amp; Tailwind CSS.
        </p>
        <SocialLinks site={site} showEmail />
      </div>
    </footer>
  );
}
