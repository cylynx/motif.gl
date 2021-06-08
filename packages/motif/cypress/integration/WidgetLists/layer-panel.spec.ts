import { SIDE_NAVBAR_WIDTH } from '../../../src/constants/widget-units';

describe('Layer Panels', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    cy.getLayerPanel().should('exist');
  });

  it('should has Header component', () => {
    cy.getLayerPanel().getReact('Header').should('exist');
  });

  it('should have node and edge properties accordions', () => {
    cy.getLayerPanel()
      .getReact('Accordion', {
        props: {
          'data-testid': 'node-properties-accordion',
        },
      })
      .should('exist');

    cy.getLayerPanel()
      .getReact('Accordion', {
        props: {
          'data-testid': 'edge-properties-accordion',
        },
      })
      .should('exist');
  });

  // TODO: Add back clear data button
  // it('should render Clear Data button', () => {
  //   cy.getLayerPanel().getReact('ClearDataButton').should('exist');
  // });

  it('should render Import Data button', () => {
    cy.getLayerPanel().getReact('ImportDataButton').should('exist');
  });

  it('should render Import Layers with zero data list on initialisation', () => {
    cy.getLayerPanel().getReact('ImportLayers').should('exist');

    cy.getReact('Accordion').should('have.length', 2);
  });
});
