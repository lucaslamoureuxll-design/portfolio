import { getSiteSettings } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Portfolio";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const site = await getSiteSettings();
  return renderOgImage({ eyebrow: "Portfolio", title: site.name, subtitle: site.tagline, footer: site.role });
}
