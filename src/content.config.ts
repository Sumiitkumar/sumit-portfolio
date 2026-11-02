import { defineCollection, z } from "astro:content";

const blogs = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default("Sumit Kumar"),
      category: z.string().optional(),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(true),
    }),
});

export const collections = { blogs };