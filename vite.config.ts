import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Crucial for Electron to load assets correctly
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Saves space by not generating debug maps
    minify: 'esbuild', // Ensures code is minified
  }
});