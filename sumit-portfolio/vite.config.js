import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Use `/` because the app is deployed at the root of a custom domain.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
