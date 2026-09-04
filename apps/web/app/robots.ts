import type { MetadataRoute } from "next";

// Kept in step with `metadataBase` in app/layout.tsx.
const SITE = "https://wrkq.sh";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
