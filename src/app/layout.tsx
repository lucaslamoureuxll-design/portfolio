import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
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
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.name,
      title: site.seo.title,
      description: site.seo.description,
    },
    twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteSettings();

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
          >
            Aller au contenu
          </a>
          <Header name={site.name} />
          <main id="contenu" className="mx-auto w-full max-w-5xl flex-1 px-4 pt-12 sm:px-6 sm:pt-20">
            {children}
          </main>
          <Footer site={site} />
        </ThemeProvider>
      </body>
    </html>
  );
}
