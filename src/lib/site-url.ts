/** Adresse officielle du site en ligne. */
export const PRODUCTION_URL = "https://www.lamoureux-lucas.com";

/**
 * URL publique du site (SEO, sitemap, aperçus de partage…).
 * Sur Vercel (production comme prévisualisations), on renvoie toujours le domaine officiel :
 * les liens « canoniques » désignent ainsi une seule adresse aux moteurs de recherche.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL) return PRODUCTION_URL;
  return "http://localhost:3000";
}

/** Vrai pour le site en production ; faux pour les prévisualisations Vercel et le local. */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}
