import { defineConfig } from 'vite';
import path from 'path';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import ts from 'typescript';
import reactRefresh from '@vitejs/plugin-react-refresh';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

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

const typescriptPlugin = typescript({
  typescript: ts,
  tsconfig: tsconfigPath,
}) as Plugin;

const babelPlugin = babel({
  babelHelpers: 'bundled',
  exclude: 'node_modules/**',
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}) as Plugin;

export default defineConfig({
  mode: 'development',
  logLevel: 'info',
  clearScreen: false,
  plugins: [typescriptPlugin, svgrPlugin],
});
