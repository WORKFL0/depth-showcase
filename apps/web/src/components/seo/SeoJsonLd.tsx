const SITE_URL = "https://depth-showcase.vercel.app";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Workflo Ochtendbrief",
      url: SITE_URL,
      description:
        "CEO cockpit voor Workflo B.V.: ochtendbrief (moet vandaag / vastgelopen / instappen), OS-kaart, sales craft en bot roster.",
      applicationCategory: "BusinessApplication",
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
      description: "Workflo — company OS, MSP craft, overnight bot surfaces.",
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
