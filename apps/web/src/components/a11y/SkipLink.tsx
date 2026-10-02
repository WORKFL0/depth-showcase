export function SkipLink({
  href = "#chamber-controls",
  label = "Skip to chamber controls",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <a href={href} className="skip-link">
      {label}
    </a>
  );
}
