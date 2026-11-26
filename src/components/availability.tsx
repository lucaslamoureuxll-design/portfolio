import type { SiteSettings } from "@/lib/content";

/** Badge « disponible » avec, en dessous, les périodes de disponibilité (dates de stage). */
export function Availability({ site, className = "" }: { site: SiteSettings; className?: string }) {
  if (!site.available) return null;
  const periods = site.availabilityPeriods?.filter(Boolean) ?? [];

  return (
    <div className={className}>
      <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-muted">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        {site.availabilityLabel || "Disponible pour de nouveaux projets"}
      </p>
      {periods.length > 0 && (
        <ul className="mt-3 space-y-1 pl-1 text-sm text-muted">
          {periods.map((period, i) => (
            <li key={period} className="flex items-baseline gap-2">
              <span aria-hidden="true" className="text-emerald-600 dark:text-emerald-400">
                ▸
              </span>
              <span>
                {i > 0 && <span className="sr-only">ou </span>}
                {period}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
