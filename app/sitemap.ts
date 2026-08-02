import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Marketing/content pages only — auth flows (login, register, password
// reset, email verification) and the authenticated /dashboard zone add no
// SEO value and are excluded.
const ROUTES = [
  "",
  "/about",
  "/features",
  "/pricing",
  "/faq",
  "/help",
  "/changelog",
  "/roadmap",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/data-deletion",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
