import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Set `base` so the app works when served from
// https://<username>.github.io/<repo>/ (GitHub Pages)
export default defineConfig({
  base: '/sumit-portfolio/',
  plugins: [react(), tailwindcss()],
})
