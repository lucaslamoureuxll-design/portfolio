import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page introuvable</h1>
      <p className="mt-4 text-muted">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition hover:opacity-90"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
