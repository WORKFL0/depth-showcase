import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: "https://depth-showcase.vercel.app",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://depth-showcase.vercel.app/brief",
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
