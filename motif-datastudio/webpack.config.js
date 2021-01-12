const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const cssFilePath = path.resolve(
  __dirname,
  'src',
  process.env.npm_package_dsccViz_cssFile || '',
);
const jsFilePath = path.resolve(
  __dirname,
  'src',
  process.env.npm_package_dsccViz_jsFile || '',
);

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
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    devServer: {
      contentBase: './dist',
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: plugins,
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
  },
];
