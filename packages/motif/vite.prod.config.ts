import { defineConfig } from 'vite';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';

const libEntryPath = path.resolve(__dirname, 'src/index.ts');
const outputDir = path.resolve(__dirname, 'dist');
const excludeDir = 'node_modules/**';

const urlPlugin = url();

const postCssPlugin = postcss({
  extract: false,
  modules: false,
  minimize: false,
}) as Plugin;

// @ts-ignore
const svgrPlugin: Plugin = svgr({
  ref: true,
  memo: true,
  svgoConfig: {
    plugins: [
      { removeViewBox: false },
      { removeAttrs: { attrs: 'g:(stroke|fill):((?!^none$).)*' } },
    ],
  },
});

export default defineConfig({
  mode: 'production',
  logLevel: 'info',
  clearScreen: false,
  plugins: [urlPlugin, postCssPlugin, svgrPlugin],
  build: {
    outDir: outputDir,
    sourcemap: false,
    minify: 'terser',
    emptyOutDir: false,
    lib: {
      entry: libEntryPath,
      formats: ['es', 'cjs', 'umd'],
      name: 'motif',
    },
    brotliSize: true,
    rollupOptions: {
      treeshake: true,
      external: [excludeDir, 'src/**/*.css', 'index.html'],
      output: {
        exports: 'named',
        freeze: false,
        globals: { react: 'React' },
      },
    },
  },
});
