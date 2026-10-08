import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo from /my-site/, not the domain root.
  base: '/my-site/',
});
