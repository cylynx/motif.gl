import { defineConfig } from 'vite';

export default defineConfig({
  mode: 'production',
  build: {
    emptyOutDir: true,
    minify: false,
    terserOptions: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  optimizeDeps: {
    keepNames: true,
  },
});
