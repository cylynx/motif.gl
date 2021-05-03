import { defineConfig } from 'vite';

export default defineConfig({
  mode: 'development',
  build: {
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      treeshake: true,
    },
  },
  optimizeDeps: {
    keepNames: true,
  },
});
