/**
 * Demo SEA mock — sample search-ad copy only.
 * Not connected to Google Ads. No spend. No Ads API.
 * Mounted as a muted footer rail below the threshold fold (not inside SeedGate).
 * Optional future: link from /sales when that surface exists.
 */
export function DemoAdCopy() {
  return (
    <aside className="demo-sea" aria-label="Demo search ad copy">
      <div className="demo-sea-inner">
        <span className="demo-sea-badge">
          Demo SEA · sample ad copy · no spend
        </span>
        <p className="demo-sea-headline">
          Depth Atelier: seed a world, then descend
        </p>
        <p className="demo-sea-url">depth-showcase.vercel.app</p>
        <p className="demo-sea-desc">
          Procedural chambers, live dive streams, constellation map. Workflo
          overnight showcase — try a seed.
        </p>
      </div>
    </aside>
  );
}
