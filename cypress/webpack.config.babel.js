const config = {
  resolve: {
    extensions: ['.tsx', '.ts', '.css', '.js', '.jsx', '.less'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader',
            options: {
              // skip typechecking for speed
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/i,
        exclude: [/node_modules/],
        use: ['less-loader'],
      },
    ],
  },
};

module.exports = config;
