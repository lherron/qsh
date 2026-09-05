import type { MetadataRoute } from "next";

// Kept in step with `metadataBase` in app/layout.tsx.
const SITE = "https://wrkq.sh";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/commands`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
