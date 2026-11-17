import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";
import { GlassPointer } from "@/components/glass-pointer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getProjects, getSiteSettings } from "@/lib/content";
import { getSiteUrl, isProduction } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: site.seo.title, template: `%s · ${site.name}` },
    description: site.seo.description,
    keywords: site.seo.keywords,
    applicationName: `Portfolio de ${site.name}`,
    authors: [{ name: site.name, url: getSiteUrl() }],
    creator: site.name,
    alternates: { canonical: "/" },
    // Seul le site de production est indexé (pas les prévisualisations Vercel).
    robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    openGraph: {
      type: "profile",
      locale: "fr_FR",
      url: "/",
      siteName: `Portfolio de ${site.name}`,
      title: site.seo.title,
      description: site.seo.description,
      firstName: site.name.split(" ")[0],
      lastName: site.name.split(" ").slice(1).join(" "),
    },
    twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, projects] = await Promise.all([getSiteSettings(), getProjects()]);

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <div className="ambient" aria-hidden="true" />
          <GlassPointer />
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
          >
            Aller au contenu
          </a>
          <Header name={site.headerLabel || site.name} />
          <main id="contenu" className="mx-auto w-full max-w-5xl flex-1 px-4 pt-10 sm:px-6 sm:pt-16">
            {children}
          </main>
          <Footer site={site} />
          <CommandPalette
            projects={projects.map(({ slug, title, technologies }) => ({ slug, title, technologies }))}
            email={site.email}
            linkedin={site.socials.linkedin || undefined}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
