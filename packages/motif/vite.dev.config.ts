import { defineConfig } from 'vite';
import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react-swc';

const reactPlugin = react();

// @ts-ignore
const svgrPlugin = svgr({
  ref: true,
  memo: true,
  svgoConfig: {
    plugins: [
      {
        name: 'removeViewBox',
      },
      {
        name: 'removeAttrs',
        params: { attrs: 'g:(stroke|fill):((?!^none$).)*' },
      },
    ],
  },
});

export default defineConfig({
  mode: 'development',
  logLevel: 'info',
  clearScreen: false,
  plugins: [reactPlugin, svgrPlugin],
  optimizeDeps: {
    esbuildOptions: {
      // prevent produce extra index behind the React component namespaces.
      keepNames: true,
    },
  },
});
