/** Adresse officielle du site en ligne. */
export const PRODUCTION_URL = "https://www.lamoureux-lucas.com";

/**
 * URL publique du site (SEO, sitemap, aperçus de partage…).
 * Sur Vercel (production comme prévisualisations), c'est toujours le domaine officiel :
 * les moteurs de recherche ne voient ainsi qu'une seule adresse, même si une ancienne
 * variable NEXT_PUBLIC_SITE_URL (ex. une adresse *.vercel.app) traîne dans les réglages.
 * Ailleurs (local, autre hébergeur), NEXT_PUBLIC_SITE_URL permet de choisir l'adresse.
 */
export function getSiteUrl(): string {
  if (process.env.VERCEL) return PRODUCTION_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return "http://localhost:3000";
}

/** Vrai pour le site en production ; faux pour les prévisualisations Vercel et le local. */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}
