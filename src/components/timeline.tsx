import type { Experience } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { Markdown } from "@/components/markdown";
import { TechBadge } from "@/components/tech-badge";

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative border-l border-border">
      {items.map((item) => (
        <li key={item.slug} className="relative pb-12 pl-6 last:pb-0 sm:pl-8">
          <span
            aria-hidden="true"
            className={`absolute top-1.5 -left-[5px] size-[9px] rounded-full ring-4 ring-background ${
              item.end ? "bg-border" : "bg-accent"
            }`}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="font-semibold tracking-tight">
              {item.role}
              <span className="font-normal text-muted"> · {item.organization}</span>
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
