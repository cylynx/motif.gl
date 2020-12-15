const url = require('@rollup/plugin-url');
const svgr = require('@svgr/rollup').default;
const postcss = require('rollup-plugin-postcss');
const path = require('path');

module.exports = {
  rollup(config, options) {
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
      ...config.plugins,
    ];
    return config;
  },
};
