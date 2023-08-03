import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';

export default defineConfig({
  e2e: {
    watchForFileChanges: false,
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: require('./cypress/webpack.config.babel'),
        watchOptions: {},
      };
      on('file:preprocessor', webpackPreprocessor(options));
      return config;
    },
  },
  env: {
    'cypress-react-selector': {
      root: '#root',
    },
  },
  video: false,
  videoCompression: false,
  screenshotOnRunFailure: false,
  viewportWidth: 1400,
  viewportHeight: 794,
});
