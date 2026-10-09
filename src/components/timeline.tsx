import type { Experience } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { Markdown } from "@/components/markdown";
import { TechBadge } from "@/components/tech-badge";

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative border-l border-border">
      {items.map((item) => (
        <li key={item.slug} className="reveal relative pb-10 pl-6 last:pb-0 sm:pl-8">
          <span
            aria-hidden="true"
            className={`absolute top-1.5 -left-[5px] size-[9px] rounded-full ring-4 ring-background ${
              item.current ? "bg-accent" : "bg-border"
            }`}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="font-semibold tracking-tight">
              {item.role}
              {item.organization && <span className="font-normal text-muted"> · {item.organization}</span>}
              {item.current && (
                <span className="ml-2 inline-flex translate-y-[-1px] items-center rounded-full bg-accent/10 px-2 py-0.5 align-middle text-xs font-medium text-accent">
                  En cours
                </span>
              )}
            </h3>
            <p className="shrink-0 text-sm text-muted tabular-nums">{formatPeriod(item.start, item.end)}</p>
          </div>
          <p className="mt-1 text-sm text-muted">
            {item.kind === "education" ? "Formation" : "Expérience"}
            {item.location ? ` · ${item.location}` : ""}
          </p>
          {item.body && (
            <div className="mt-3 text-[15px]">
              <Markdown source={item.body} />
            </div>
          )}
          {item.technologies.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
              {item.technologies.map((tech) => (
                <li key={tech}>
                  <TechBadge>{tech}</TechBadge>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
