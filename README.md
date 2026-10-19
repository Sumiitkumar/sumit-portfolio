# Sumit Kumar Portfolio

Static portfolio and Markdown-powered blog built with Astro.

## Local development

```sh
npm install
npm run dev
```

Astro prints the local URL after the development server starts.

## Write a blog post

1. Add a Markdown file under `src/content/blogs/`, for example `kubernetes-notes.md`.
2. Start it with frontmatter:

	 ```yaml
	 ---
	 title: "Your article title"
	 description: "A short summary for the blog index and search previews."
	 pubDate: 2026-10-19
	 tags:
		 - Kubernetes
	 draft: true
	 ---
	 ```

3. Write the article below the closing `---` using Markdown.
4. Preview it locally with `npm run dev`. Draft posts stay hidden from the public blog.
5. When it is ready, set `draft: false`, then commit and push the change.

Published posts appear at `/blogs/` and `/blogs/<filename>/`.

## Build and deploy

Run `npm run build`; the static site is written to `dist/`. Configure the hosting provider to build with `npm run build` and publish `dist/`. Connect the Git repository to a provider with automatic deployments to publish each pushed change. No database or server-side runtime is required for blog posts.

The exact automatic-deployment setup depends on the provider currently serving `sumit.cloud`.
