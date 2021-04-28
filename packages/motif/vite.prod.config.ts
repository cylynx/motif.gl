import { defineConfig } from 'vite';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
// @ts-ignore
import svgr from '@svgr/rollup';

const libEntryPath = path.resolve(__dirname, 'src/index.ts');
const outputDir = path.resolve(__dirname, 'dist');

// extract the css from the modules into specific file
const motifCssPath = path.resolve(__dirname, 'dist/motif.css');
const postCssPlugin = postcss({
  extract: motifCssPath,
}) as Plugin;

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

// locate and bundle third party plugins into current package, target specific environments
const resolvePlugin = resolve({
  mainFields: ['module', 'main', 'node', 'browser'],
  extensions: ['.js', 'jsx'],
}) as Plugin;

// perform transpilation into bundle
const babelPlugin = babel({
  exclude: /\/node_modules\//,
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  babelHelpers: 'bundled',
}) as Plugin;

export default defineConfig({
  mode: 'production',
  logLevel: 'error',
  clearScreen: false,
  plugins: [resolvePlugin, babelPlugin, postCssPlugin, svgrPlugin],
  build: {
    outDir: outputDir,

    // generate source map for debugging in the client
    sourcemap: true,
    minify: 'terser',

    // prevent empty output directory as it contains typescript declarations.
    emptyOutDir: false,
    lib: {
      entry: libEntryPath,
      formats: ['es', 'cjs'],
      name: 'motif',
    },
    terserOptions: {
      // keep the function name during minification to ease up debugging
      keep_fnames: true,
    },
    brotliSize: true,
    rollupOptions: {
      treeshake: true,

      // prevent bundle peer dependencies to avoid unexpected errors
      external: [
        'react',
        'react-dom',
        'react-redux',
        '@reduxjs/toolkit',
        'styletron-engine-atomic',
        'styletron-react',
        'baseui',
      ],
      output: {
        exports: 'named',
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
