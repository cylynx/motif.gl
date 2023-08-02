import { defineConfig } from 'vite';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import { visualizer } from 'rollup-plugin-visualizer';
// @ts-ignore
import svgr from '@svgr/rollup';

const libEntryPath = path.resolve(__dirname, 'src/index.ts');
const outputDir = path.resolve(__dirname, 'dist');

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
});

// locate and bundle third party plugins into current package, target specific environments
const resolvePlugin = resolve({
  mainFields: ['module', 'main', 'node', 'browser'],
  extensions: ['.js', 'jsx'],
});

const visualiserPlugin = visualizer();

export default defineConfig({
  mode: 'production',
  logLevel: 'error',
  clearScreen: false,
  plugins: [resolvePlugin, svgrPlugin, visualiserPlugin],
  build: {
    outDir: outputDir,

    // enable sourcemap for debugging in the production build
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
        'attr-accept',
      ],
      output: {
        exports: 'named',
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
