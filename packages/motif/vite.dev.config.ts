import { defineConfig } from 'vite';
import svgr from '@svgr/rollup';
import reactRefresh from '@vitejs/plugin-react-refresh';

// @ts-ignore
const svgrPlugin = svgr({
  ref: true,
  memo: true,
  svgoConfig: {
    plugins: [
      { removeViewBox: false },
      { removeAttrs: { attrs: 'g:(stroke|fill):((?!^none$).)*' } },
    ],
  },
}) as Plugin;

const reactRefreshPlugin = reactRefresh();

export default defineConfig({
  mode: 'development',
  logLevel: 'info',
  clearScreen: false,
  plugins: [reactRefreshPlugin, svgrPlugin],
  optimizeDeps: {
    // prevent produce extra index behind the React component namespaces.
    keepNames: true,
  },
});
