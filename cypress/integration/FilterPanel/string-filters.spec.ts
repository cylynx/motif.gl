/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('String Filters', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking circle graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.CIRCLE_GRAPH },
    })
      .find('Button')
      .click();
  });

  describe('Filter with Node String Variable', () => {
    beforeEach(() => {
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

    it('should perform filter with one variable', () => {
      // type label and label id as string variable
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('label{enter}');

      // select node-node-0 in multi string select
      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('node-node-0{enter}');

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

      // possess only one edge and one node
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 1);
    });

    it('should perform filter with multi variable', () => {
      // type label and select label as string variable
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('label{enter}');

      // select two variables in multi string select
      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('node-node-0{enter}')
        .type('node-node-1{enter}');

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

      // possess three edges and two nodes
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 3);
    });
  });

  describe('Filter with Edge String Variable', () => {
    beforeEach(() => {
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

    it('should perform filter with one variable', () => {
      // type source and select as string variable
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('source{enter}');

      // select node-1 in multi string select
      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('node-1{enter}');

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

      // possess only one edge and two nodes
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 1);
    });

    it('should perform filter with multi variable', () => {
      // type source and select label as string variable
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('source{enter}');

      // select two variables in multi string select
      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('node-1{enter}')
        .type('node-0{enter}');

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

      // possess three edges and two nodes
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 10);
    });
  });
});
