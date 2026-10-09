import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email-button";
import { PageHeading } from "@/components/section-heading";
import { SocialLinks } from "@/components/social-links";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question, un projet ? Écrivez-moi.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
      <div>
        <PageHeading eyebrow="Contact" title="Travaillons ensemble">
          Une question, une opportunité ou simplement envie d&apos;échanger ? Je réponds généralement sous 48 h.
        </PageHeading>
        <p className="text-sm text-muted">Mon adresse e-mail :</p>
        <div className="mt-3">
          <CopyEmailButton email={site.email} />
        </div>
        <p className="mt-8 text-sm text-muted">Retrouvez-moi aussi sur :</p>
        <SocialLinks site={site} className="mt-3" />
      </div>
      <ContactForm email={site.email} />
    </div>
  );
}
