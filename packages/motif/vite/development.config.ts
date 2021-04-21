import { defineConfig } from 'vite';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';

const libEntryPath = path.resolve(__dirname, '../src/index.tsx');
const outputDir = path.resolve(__dirname, '../dist');
const excludeDir = '/node_modules/';

const postCssPlugin = postcss({ extract: true }) as Plugin;
const commonJsPlugin = commonjs({
  exclude: excludeDir,
  sourceMap: true,
}) as Plugin;
const urlPlugin = url();

export default defineConfig({
  mode: 'development',
  logLevel: 'info',
  clearScreen: false,
  plugins: [postCssPlugin, commonJsPlugin, urlPlugin],
  build: {
    outDir: outputDir,
    sourcemap: true,
    minify: false,
    emptyOutDir: false,
    lib: {
      entry: libEntryPath,
      formats: ['es', 'cjs', 'umd'],
      name: 'motif',
    },
    brotliSize: false,
  },
});
