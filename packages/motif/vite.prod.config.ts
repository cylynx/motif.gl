import { defineConfig } from 'vite';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import svgr from '@svgr/rollup';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const libEntryPath = path.resolve(__dirname, 'src/index.ts');
const outputDir = path.resolve(__dirname, 'dist');

const postCssPlugin = postcss({
  extract: false,
  modules: false,
  minimize: false,
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

const resolvePlugin = resolve({
  mainFields: ['module', 'main', 'node', 'browser'],
  extensions: ['.js', 'jsx'],
}) as Plugin;

const babelPlugin = babel({
  exclude: /\/node_modules\//,
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}) as Plugin;

export default defineConfig({
  mode: 'production',
  logLevel: 'error',
  clearScreen: false,
  plugins: [resolvePlugin, babelPlugin, postCssPlugin, svgrPlugin],
  build: {
    outDir: outputDir,
    sourcemap: true,
    minify: 'terser',
    emptyOutDir: false,
    lib: {
      entry: libEntryPath,
      formats: ['es', 'cjs'],
      name: 'motif',
    },
    brotliSize: true,
    rollupOptions: {
      treeshake: true,
      external: [
        'react',
        'react-dom',
        'react-redux',
        '@reduxjs/toolkit',
        'styletron-engine-atomic',
        'styletron-react',
      ],
      output: {
        exports: 'named',
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
