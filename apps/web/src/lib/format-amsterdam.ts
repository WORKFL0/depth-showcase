/** Format ISO timestamps for Florian (Europe/Amsterdam). */
export function formatAmsterdam(
  iso: string,
  opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  },
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    ...opts,
  }).format(d);
}

export function formatAmsterdamTime(iso: string): string {
  return formatAmsterdam(iso, { hour: "2-digit", minute: "2-digit" });
}
