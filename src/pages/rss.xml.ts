import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_URL } from "../consts";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blogs", ({ data }) => !data.draft)).sort(
    (first, second) => second.data.pubDate.valueOf() - first.data.pubDate.valueOf(),
  );
  const blogUrl = new URL("/blogs/", SITE_URL).href;
  const items = posts
    .map((post) => {
      const url = new URL(`/blogs/${post.slug}/`, SITE_URL).href;
      const categories = [
        ...(post.data.category ? [post.data.category] : []),
        ...post.data.tags,
      ].map(
        (tag) => `      <category>${escapeXml(tag)}</category>`,
      );
      return [
        "    <item>",
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(post.data.description)}</description>`,
        `      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>`,
        ...categories,
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Field Notes by Sumit Kumar</title>",
    `    <link>${escapeXml(blogUrl)}</link>`,
    `    <description>${escapeXml("Practical articles on Kubernetes, GPUs, DevOps, cloud infrastructure, and reliability.")}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
