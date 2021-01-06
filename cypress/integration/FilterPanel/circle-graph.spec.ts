/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Filter Circle Graph', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.CIRCLE_GRAPH },
    })
      .find('Button')
      .click();

    cy.react('Block', {
      props: {
        'data-testid': 'filters',
      },
      exact: true,
    })
      .react('IconButton', {
        props: { id: 'filters', group: 'main' },
      })
      .click();
  });

  it('FilterSelection should display render after [Add Filter] button is clicked', () => {
    cy.react('AddFilterButton').click();
    cy.getReact('FilterSelection').should('exist');
  });
});
