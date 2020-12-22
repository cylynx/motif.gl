/**
 * @type {Cypress.PluginConfig}
 */
export default (on: any, config: any) => {
  require('@cypress/react/plugins/react-scripts')(on, config);

  return config;
};
//
// module.exports = (on, config) => {
//   // `on` is used to hook into various events Cypress emits
//   // `config` is the resolved Cypress config
// };
