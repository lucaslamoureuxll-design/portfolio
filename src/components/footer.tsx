import type { SiteSettings } from "@/lib/content";
import { SocialLinks } from "@/components/social-links";

export function Footer({ site }: { site: SiteSettings }) {
  return (
    <footer className="mt-24 px-3 pb-6 sm:px-6">
      <div className="glass mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 rounded-3xl px-6 py-5 text-sm text-muted sm:flex-row">
        <p>
          © {site.name}. Construit avec Next.js &amp; Tailwind CSS.
        </p>
        <SocialLinks site={site} showEmail />
      </div>
    </footer>
  );
}
