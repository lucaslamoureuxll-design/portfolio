const monthFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2024-03" ou "2024-03-15" → "mars 2024" */
export function formatMonth(value?: string): string {
  if (!value) return "";
  const [year, month = "1"] = value.split("-");
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  if (Number.isNaN(date.getTime())) return value;
  return monthFormatter.format(date);
}

export function formatPeriod(start: string, end?: string): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : "aujourd'hui"}`;
}
