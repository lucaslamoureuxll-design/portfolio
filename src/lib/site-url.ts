/** URL publique du site (utilisée pour le SEO, le sitemap…). */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // Variable fournie automatiquement par Vercel.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

/** Vrai pour le site en production ; faux pour les prévisualisations Vercel et le local. */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}
