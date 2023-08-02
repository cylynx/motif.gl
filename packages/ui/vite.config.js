import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const reactPlugin = react();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactPlugin],
  optimizeDeps: {
    esbuildOptions: {
      keepNames: true,
    },
  },
});
