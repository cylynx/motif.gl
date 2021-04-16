const path = require('path');
const AliasPlugin = require('enhanced-resolve/lib/AliasPlugin');

module.exports = {
  resolve: {
    plugins: [
      new AliasPlugin(
        'described-resolve',
        [
          {
            name: 'react',
            alias: [
              path.resolve(__dirname, './node_modules/react'),
              path.resolve(__dirname, '../node_modules/react'),
            ],
          },
          {
            name: 'react-dom',
            alias: [
              path.resolve(__dirname, './node_modules/react-dom'),
              path.resolve(__dirname, '../node_modules/react-dom'),
            ],
          },
        ],
        'resolve',
      ),
    ],
  },
};
