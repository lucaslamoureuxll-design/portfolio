import type { SiteSettings } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MailIcon, XIcon } from "@/components/icons";

type Props = {
  site: SiteSettings;
  showEmail?: boolean;
  className?: string;
};

export function SocialLinks({ site, showEmail = false, className = "" }: Props) {
  const links = [
    { href: site.socials.github, label: "GitHub", Icon: GitHubIcon },
    { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.socials.twitter, label: "Twitter / X", Icon: XIcon },
    { href: showEmail && site.email ? `mailto:${site.email}` : undefined, label: "E-mail", Icon: MailIcon },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex size-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-foreground hover:text-foreground"
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
