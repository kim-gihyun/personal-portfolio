import type { Metadata } from "next";

const SITE = "Gihyun Kim";
const OG_IMAGES = [{ url: "/assets/og-card.png", width: 1200, height: 630 }];

/**
 * Complete per-page OG/Twitter block. Next.js shallow-merges metadata segments,
 * so a page that sets `openGraph` replaces the root layout's entirely — this
 * keeps every page's og:title/og:description in step with its own <title> and
 * meta description while re-supplying the shared fields (url resolves against
 * metadataBase in the root layout).
 */
export function pageOg(
  title: string,
  description: string,
  path: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const full = `${title} — ${SITE}`;
  return {
    openGraph: {
      title: full,
      description,
      url: path,
      siteName: SITE,
      images: OG_IMAGES,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: ["/assets/og-card.png"],
    },
  };
}
