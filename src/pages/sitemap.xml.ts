import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_URL } from "../consts";
import { BLOGS_PER_PAGE, getBlogPageCount } from "../utils/blog-pagination";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blogs", ({ data }) => !data.draft)).sort(
    (first, second) => second.data.pubDate.valueOf() - first.data.pubDate.valueOf(),
  );
  const totalPages = getBlogPageCount(posts.length);
  const entries = [
    { path: "/", lastModified: undefined },
    { path: "/blogs/", lastModified: undefined },
    { path: "/privacy-policy/", lastModified: undefined },
    ...Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      path: `/blogs/page/${index + 2}/`,
      lastModified: undefined,
    })),
    ...posts.map((post) => ({
      path: `/blogs/${post.slug}/`,
      lastModified: post.data.updatedDate ?? post.data.pubDate,
    })),
  ];
  const escapeXml = (value: string) =>
    value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const urls = entries
    .map(({ path, lastModified }) => {
      const location = escapeXml(new URL(path, SITE_URL).href);
      const modified = lastModified
        ? `<lastmod>${lastModified.toISOString().slice(0, 10)}</lastmod>`
        : "";
      return `  <url><loc>${location}</loc>${modified}</url>`;
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
};
