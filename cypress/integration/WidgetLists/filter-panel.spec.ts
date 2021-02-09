import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import { SIDE_NAVBAR_WIDTH } from '../../../src/constants/widget-units';

describe('Filter Panel', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);

    // close modal
    cy.get('button[aria-label="Close"]').click();

    // open filter panels by clicking sidebar
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

  it('should render successfully', () => {
    cy.getReact('FilterPanel').should('exist');
  });

  it('should render beside Left Navigation Bar', () => {
    cy.getReact('LeftLayer')
      .getReact('FilterPanel')
      .should('exist');
  });

  it('should render Header component', () => {
    cy.getReact('FilterPanel')
      .getReact('Header')
      .should('exist');
  });

  it('FilterSelection should not be render when no data is present', () => {
    cy.get('[data-testid="filter-panel:filter-selection"]').should('not.exist');
  });

  describe('AddFilterButton', () => {
    it('should render successfully', () => {
      cy.getReact('FilterPanel')
        .getReact('AddFilterButton')
        .should('exist');
    });

    it('should be disabled when no data is present', () => {
      cy.getReact('FilterPanel')
        .getReact('AddFilterButton')
        .getProps('disabled')
        .should('deep.eq', true);
    });

    it('should be enable when data is present', () => {
      // open layer panels
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

      cy.react('LayersPanel')
        .react('ImportDataButton')
        .click();

      cy.switchTab('sample-data');

      // import sample data by clicking random graph
      cy.react('Cell', {
        props: { 'data-testid': SampleData.CIRCLE_GRAPH },
      })
        .find('Button')
        .click();

      // open filter panels by clicking sidebar
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

      cy.getReact('FilterPanel')
        .getReact('AddFilterButton')
        .getProps('disabled')
        .should('deep.eq', false);
    });
  });

  describe('FilterSelection', () => {
    it('should display render after [Add Filter] button is clicked', () => {
      cy.react('AddFilterButton').click();
      cy.getReact('FilterSelection').should('exist');
    });

    it('should render SelectVariable component', () => {
      const selectVariable = cy
        .getReact('FilterSelection')
        .getReact('Header')
        .getReact('SelectVariable');

      selectVariable.should('exist');
    });

    it('should render Delete Button', () => {
      cy.getReact('FilterSelection')
        .getReact('Header')
        .getReact('Button', {
          props: {
            'data-testid': 'filter-selection-header:delete',
          },
        })
        .should('exist');
    });
  });
});
