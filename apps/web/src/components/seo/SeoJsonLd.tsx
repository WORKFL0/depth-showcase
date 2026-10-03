const SITE_URL = "https://depth-showcase.vercel.app";

const DESCRIPTION =
  "Wij zijn de IT-afdeling van je bedrijf. Eerst wat er vandaag moet, dan de rest.";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "De zaak, vóór de inbox",
      alternateName: "Workflo",
      url: SITE_URL,
      description: DESCRIPTION,
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
