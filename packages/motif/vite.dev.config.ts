import { defineConfig } from 'vite';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import reactRefresh from '@vitejs/plugin-react-refresh';

const urlPlugin = url();

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
});
