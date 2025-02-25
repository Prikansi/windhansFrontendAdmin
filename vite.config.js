import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  define: {
    'process.env': process.env, // Keeps the environment variables intact
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for 'src' folder
      '@tailwindConfig': path.resolve(__dirname, 'tailwind.config.js'), // Alias for Tailwind config
    },
  },
  optimizeDeps: {
    include: [
      '@tailwindConfig', // Ensure Tailwind config is optimized
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Fixes issues with mixed ES modules and CommonJS
    },
  },
});
