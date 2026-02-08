// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Your Vite configuration options go here.
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});