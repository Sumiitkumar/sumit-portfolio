import { defineConfig } from "astro/config";

const base =
  process.env.GITHUB_ACTIONS === "true" ? "/sumit-portfolio" : "/";

export default defineConfig({
  site: "https://sumiitkumar.github.io",
  base,
  output: "static",
});