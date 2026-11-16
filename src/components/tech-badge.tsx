export function TechBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/[0.06] bg-white/55 px-2.5 py-0.5 text-xs font-medium text-muted dark:border-white/10 dark:bg-white/[0.07]">
      {children}
    </span>
  );
}
