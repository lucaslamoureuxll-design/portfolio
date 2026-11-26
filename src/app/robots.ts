import type { MetadataRoute } from "next";
import { getSiteUrl, isProduction } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Les prévisualisations Vercel ne doivent pas être indexées (contenu en double).
  if (!isProduction()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/cv/"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
