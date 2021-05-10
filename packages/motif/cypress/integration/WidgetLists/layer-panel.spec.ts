import { SIDE_NAVBAR_WIDTH } from '../../../src/constants/widget-units';

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
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        left: SIDE_NAVBAR_WIDTH,
        width: '310px',
        paddingTop: 'scale600',
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
      .nthNode(0)
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

    cy.getReact('DataListAccordion').getProps('items').should('have.length', 0);
  });
});
