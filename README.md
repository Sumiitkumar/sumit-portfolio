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

## SEO and domains

`https://sumit.cloud` is the primary domain used for canonical URLs, sitemap entries, and structured data. GitHub Pages serves the same site and keeps its `*.github.io` address available, while canonical metadata signals that `sumit.cloud` is the preferred URL to search engines. The sitemap and robots file are generated at `/sitemap.xml` and `/robots.txt`.

After deploying, verify both domains and submit `https://sumit.cloud/sitemap.xml` in Google Search Console. GitHub Pages must have the custom domain `sumit.cloud` configured, and its DNS must point to GitHub Pages.

## GitHub Pages

The repository workflow builds and deploys the `main` branch to GitHub Pages. Pull requests run the build without deploying. The site uses the custom domain `sumit.cloud` and is built with a root base path (`/`) so stylesheets, images, and page links resolve correctly there.

One-time setup in GitHub:

1. Open the repository's **Settings**.
2. Open **Pages** under **Code and automation**.
3. Set **Build and deployment** source to **GitHub Actions**.
4. Push to `main`, or run the **Deploy to GitHub Pages** workflow from the Actions tab.

The workflow runs `npm ci` and `npm run build`, then publishes `dist/`. To use a different custom domain, add it in Pages settings and configure its DNS.
