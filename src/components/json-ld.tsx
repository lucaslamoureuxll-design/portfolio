import type { SiteSettings } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Données structurées (schema.org) : aident Google à comprendre que ce site
 * est le portfolio de la personne, et à l'associer à son nom et à ses profils.
 */
export function PersonJsonLd({ site }: { site: SiteSettings }) {
  const url = getSiteUrl();
  const [firstName, ...rest] = site.name.split(" ");
  const lastName = rest.join(" ");

  const person = {
    "@type": "Person",
    "@id": `${url}/#person`,
    name: site.name,
    alternateName: lastName ? `${lastName} ${firstName}` : undefined,
    givenName: firstName,
    familyName: lastName || undefined,
    jobTitle: site.role,
    description: site.intro,
    url,
    email: site.email ? `mailto:${site.email}` : undefined,
    image: site.avatar ? new URL(site.avatar, url).toString() : undefined,
    sameAs: Object.values(site.socials).filter(Boolean),
    knowsAbout: site.skills?.flatMap((group) => group.items),
    address: site.location ? { "@type": "PostalAddress", addressCountry: site.location } : undefined,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: `Portfolio de ${site.name}`,
        alternateName: [`${site.name} — Portfolio`, `Portfolio ${person.alternateName ?? site.name}`],
        inLanguage: "fr-FR",
        publisher: { "@id": `${url}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}/#profile`,
        url,
        name: site.seo.title,
        description: site.seo.description,
        inLanguage: "fr-FR",
        isPartOf: { "@id": `${url}/#website` },
        mainEntity: person,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Échappe « < » pour éviter toute injection HTML (recommandation Next.js).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
