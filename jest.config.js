const config = {
  preset: 'ts-jest/presets/js-with-ts',
  testPathIgnorePatterns: ['cypress', '/node_modules/'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  setupFiles: ['jsdom-worker'],
  transformIgnorePatterns: ['/node_modules/'],
};

module.exports = config;
