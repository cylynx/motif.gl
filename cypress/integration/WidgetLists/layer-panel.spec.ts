/// <reference types="cypress" />
import 'cypress-react-selector';

describe('Layer Panels', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    cy.getReact('LayersPanel').should('exist');
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
      .getReact('LayersPanel')
      .should('exist');
  });

  it('should has Header component', () => {
    cy.getReact('LayersPanel').getReact('Header').should('exist');
  });

  it('should has node and edge statistics', () => {
    cy.getReact('LayersPanel')
      .getReact('Statistic', {
        props: {
          'data-testid': 'nodes-count',
        },
      })
      .should('exist');

    cy.getReact('LayersPanel')
      .getReact('Statistic', {
        props: {
          'data-testid': 'edges-count',
        },
      })
      .should('exist');
  });

  it('nodes and edges statistic should initialize with zero', () => {
    cy.getReact('LayersPanel')
      .getReact('Statistic', {
        props: {
          'data-testid': 'nodes-count',
        },
      })
      .getProps('value')
      .should('deep.eq', 0);

    cy.getReact('LayersPanel')
      .getReact('Statistic', {
        props: {
          'data-testid': 'edges-count',
        },
      })
      .getProps('value')
      .should('deep.eq', 0);
  });

  it('should have node and edge properties accordions', () => {
    cy.getReact('LayersPanel')
      .getReact('Accordion', {
        props: {
          'data-testid': 'node-properties-accordion',
        },
      })
      .should('exist');

    cy.getReact('LayersPanel')
      .getReact('Accordion', {
        props: {
          'data-testid': 'edge-properties-accordion',
        },
      })
      .should('exist');
  });

  it('should render Clear Data button', () => {
    cy.getReact('LayersPanel').getReact('ClearDataButton').should('exist');
  });

  it('should render Import Data button', () => {
    cy.getReact('LayersPanel').getReact('ImportDataButton').should('exist');
  });

  it('should render Import Layers with zero data list on initialisation', () => {
    cy.getReact('LayersPanel').getReact('ImportLayers').should('exist');

    cy.getReact('DndList').getProps('items').should('have.length', 0);
  });
});
