/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Random Graph successfully', () => {
    cy.react('Tabs')
      .react('InternalTab', {
        props: { childKey: 'sample-data' },
      })
      .click();

    cy.react('Cell', {
      props: { 'data-testid': SampleData.RANDOM_GRAPH },
    })
      .find('Button')
      .click();
  });
});
