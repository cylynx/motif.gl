/// <reference types="cypress" />
import 'cypress-react-selector';

describe('Filter Panel', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

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
    cy.react('Block', {
      props: {
        position: 'fixed',
        top: '10px',
        bottom: '10px',
        left: '60px',
        width: '310px',
        paddingTop: 'scale200',
        paddingBottom: 'scale200',
        paddingLeft: 'scale550',
        paddingRight: 'scale550',
        backgroundColor: 'backgroundPrimary',
        overflow: 'auto',
      },
      exact: true,
    })
      .getReact('FilterPanel')
      .should('exist');
  });

  it('should render Header component', () => {
    cy.getReact('FilterPanel').getReact('Header').should('exist');
  });

  it('should render AddFilterButton component', () => {
    cy.getReact('FilterPanel').getReact('AddFilterButton').should('exist');
  });
});
