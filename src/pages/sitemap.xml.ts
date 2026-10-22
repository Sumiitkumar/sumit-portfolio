import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_URL } from "../consts";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blogs", ({ data }) => !data.draft);
  const paths = ["/", "/blogs/", ...posts.map((post) => `/blogs/${post.slug}/`)];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, SITE_URL).href}</loc></url>`)
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
