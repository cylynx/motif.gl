import { defineConfig } from 'vite';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
const excludeDir = 'node_modules/**';

const postCssPlugin = postcss({ extract: true }) as Plugin;
const urlPlugin = url();

const commonJsPlugin = commonjs({
  exclude: excludeDir,
  sourceMap: true,
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

const typescriptPlugin = typescript({
  tsconfig: tsconfigPath,
}) as Plugin;

export default defineConfig({
  mode: 'development',
  logLevel: 'info',
  clearScreen: false,
  plugins: [commonJsPlugin, postCssPlugin, urlPlugin, svgrPlugin],
});
