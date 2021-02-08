import * as Cypress from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';

/**
 * @param {Cypress.PluginEvents} on
 * @param {Cypress.PluginConfigOptions} config
 */
export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => {
  const options = {
    webpackOptions: require('../webpack.config.babel'),
    watchOptions: {},
  };
  on('file:preprocessor', webpackPreprocessor(options));
  return config;
};
