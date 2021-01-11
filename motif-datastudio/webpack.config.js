const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { cssFile, jsFile } = require('@google/dscc-scripts/build/viz/util');

// const components = getBuildableComponents();
// const componentIndexToBuild = Number(process.env.WORKING_COMPONENT_INDEX) || 0;
// const component = components[componentIndexToBuild];

// console.log(`Building ${component.tsFile || component.jsFile}...`);

const cssFilePath = path.resolve(__dirname, 'src', cssFile || '');
const jsFilePath = path.resolve(__dirname, 'src', jsFile || '');

const plugins = [
  // Add DSCC_IS_LOCAL definition
  new webpack.DefinePlugin({
    DSCC_IS_LOCAL: 'true',
  }),
];

let body = '<script src="main.js"></script>';
if (fs.existsSync(cssFilePath)) {
  body = body + '\n<link rel="stylesheet" href="index.css">';
  plugins.push(new CopyWebpackPlugin([{ from: cssFilePath, to: '.' }]));
}
const iframeHTML = `
<!doctype html>
<html><body id="root">
${body}
</body></html>
`;

fs.writeFileSync(path.resolve(__dirname, 'dist', 'vizframe.html'), iframeHTML);

module.exports = [
  {
    mode: 'development',
    entry: jsFilePath,
    devServer: {
      contentBase: './dist',
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: plugins,
  },
];
