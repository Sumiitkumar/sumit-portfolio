# sumit__portfolio

## GitHub Pages deployment

This project is configured for GitHub Pages deployment from the `out/` directory.

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

The site will be published at `https://Sumiitkumar.github.io/sumit-portfolio`.

### Notes

- `next.config.mjs` sets `output: 'export'`, `basePath`, and `assetPrefix` for GitHub Pages.
- `gh-pages` publishes the generated `out/` folder.
