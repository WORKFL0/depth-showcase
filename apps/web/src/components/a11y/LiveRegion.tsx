"use client";

export function LiveRegion({ message }: { message: string }) {
  return (
    <div className="sr-only" aria-live="assertive" aria-atomic="true">
      {message}
    </div>
  );
}
