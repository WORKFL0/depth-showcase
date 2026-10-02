const SITE_URL = "https://depth-showcase.vercel.app";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Depth Atelier",
      url: SITE_URL,
      description:
        "Generative infinite-descent atelier: seeded chambers, SSE dives, constellation graph. Built overnight by Workflo OS bots.",
      applicationCategory: "GameApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Workflo",
      url: "https://workflo.it",
      description: "Workflo builds overnight capability showcases with OS bots.",
    },
  ],
};

export function SeoJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
