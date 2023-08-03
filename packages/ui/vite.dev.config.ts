import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const reactPlugin = react();

export default defineConfig({
  mode: 'production',
  plugins: [reactPlugin],
  build: {
    emptyOutDir: true,
    minify: false,
    terserOptions: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      keepNames: true,
    },
  },
});
