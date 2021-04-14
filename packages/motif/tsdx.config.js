const url = require('@rollup/plugin-url');
const svgr = require('@svgr/rollup').default;
const postcss = require('rollup-plugin-postcss');
const path = require('path');
const replace = require('@rollup/plugin-replace');

module.exports = {
  rollup(config, opts) {
    config.plugins = [
      postcss({
        extract: path.resolve('dist/index.css'),
      }),
      url(),
      svgr({
        ref: true,
        memo: true,
        svgoConfig: {
          plugins: [
            { removeViewBox: false },
            { removeAttrs: { attrs: 'g:(stroke|fill):((?!^none$).)*' } },
          ],
        },
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
        preventAssignment: true,
      }),
      ...config.plugins,
    ];
    return config;
  },
};
