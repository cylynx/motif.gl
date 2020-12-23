import Cypress from 'cypress';

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: any, config: any) => {
  require('@cypress/react/plugins/react-scripts')(on, config);

  return config;
};
