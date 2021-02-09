import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Layout Options', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.CIRCLE_GRAPH);
    cy.switchPanel('options');
  });

  it('should render successfully', () => {
    cy.getReact('OptionsPanel').should('exist');
  });
});
