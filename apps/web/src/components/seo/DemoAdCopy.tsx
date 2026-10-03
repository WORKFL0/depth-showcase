/**
 * Demo SEA mock. Sample search-ad copy only.
 * Not connected to Google Ads. No spend. No Ads API.
 * One Workflo site. Not a separate product.
 */
export function DemoAdCopy() {
  return (
    <aside className="demo-sea" aria-label="Demo search ad copy">
      <div className="demo-sea-inner">
        <span className="demo-sea-badge">
          Demo SEA · sample ad copy · no spend
        </span>
        <p className="demo-sea-headline">De zaak, vóór de inbox</p>
        <p className="demo-sea-url">depth-showcase.vercel.app</p>
        <p className="demo-sea-desc">
          Wij zijn de IT-afdeling van je bedrijf. Voorbeeldadvertentie, geen
          spend.
        </p>
      </div>
    </aside>
  );
}
