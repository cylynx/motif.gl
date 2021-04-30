const config = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
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
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/i,
        use: ['css-loader'],
      },
      {
        test: /\.less$/,
        use: [{ loader: 'css-loader' }],
        sideEffects: true,
      },
    ],
  },
};

module.exports = config;
