/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Random Graph successfully', () => {
    cy.switchTab('sample-data');
    cy.react('Cell', {
      props: { 'data-testid': SampleData.RANDOM_GRAPH },
    })
      .find('Button')
      .click();
  });
});
