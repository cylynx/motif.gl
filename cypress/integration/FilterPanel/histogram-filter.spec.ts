/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Histogram Filters', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking bank
    cy.react('Cell', {
      props: { 'data-testid': SampleData.BANK },
    })
      .find('Button')
      .click();

    // switch to filter panel
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

    cy.react('AddFilterButton').click();
  });

  afterEach(() => {
    cy.react('ClearDataButton').click();
  });

  it('should filter with Numeric Variable', () => {
    // type risk score as numeric variable
    cy.react('FilterSelection')
      .react('Header')
      .react('SelectVariable', {
        props: {
          'data-testid': 'filter-selection-header:select-variable',
        },
      })
      .first()
      .type('risk_score{enter}');

    // switch to layer panel
    cy.react('Block', {
      props: {
        'data-testid': 'layers',
      },
      exact: true,
    })
      .react('IconButton', {
        props: { id: 'layers', group: 'main' },
      })
      .click();

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 7);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
  });

  it('should filter with DateTime Variable', () => {
    // select variable
    cy.react('FilterSelection')
      .react('Header')
      .react('SelectVariable', {
        props: {
          'data-testid': 'filter-selection-header:select-variable',
        },
      })
      .first()
      .type('create_date{enter}');

    // switch to layer panel
    cy.react('Block', {
      props: {
        'data-testid': 'layers',
      },
      exact: true,
    })
      .react('IconButton', {
        props: { id: 'layers', group: 'main' },
      })
      .click();

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
  });

  it('should filter with Date Variable', () => {
    // select variable
    cy.react('FilterSelection')
      .react('Header')
      .react('SelectVariable', {
        props: {
          'data-testid': 'filter-selection-header:select-variable',
        },
      })
      .first()
      .type('date{enter}');

    // switch to layer panel
    cy.react('Block', {
      props: {
        'data-testid': 'layers',
      },
      exact: true,
    })
      .react('IconButton', {
        props: { id: 'layers', group: 'main' },
      })
      .click();

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
  });

  it('should filter with Time Variable', () => {
    // select variable
    cy.react('FilterSelection')
      .react('Header')
      .react('SelectVariable', {
        props: {
          'data-testid': 'filter-selection-header:select-variable',
        },
      })
      .first()
      .type('time{enter}');

    // switch to layer panel
    cy.react('Block', {
      props: {
        'data-testid': 'layers',
      },
      exact: true,
    })
      .react('IconButton', {
        props: { id: 'layers', group: 'main' },
      })
      .click();

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
  });
});
