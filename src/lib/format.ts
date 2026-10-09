const monthFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2024" → "2024" ; "2024-03" ou "2024-03-15" → "mars 2024" */
export function formatMonth(value?: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!month) return year;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  if (Number.isNaN(date.getTime())) return value;
  return monthFormatter.format(date);
}

/** Période affichée dans la timeline : "2025", "2025 — 2026" ou "sept. 2024 — aujourd'hui". */
export function formatPeriod(start: string, end?: string): string {
  if (end && end === start) return formatMonth(start);
  return `${formatMonth(start)} — ${end ? formatMonth(end) : "aujourd'hui"}`;
}

/** Temps de lecture estimé (≈ 200 mots/minute). */
export function readingTime(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}
