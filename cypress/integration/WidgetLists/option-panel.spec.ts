/// <reference types="cypress" />
import 'cypress-react-selector';

describe('Option Panel', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();

    // open option panels by clicking sidebar
    cy.react('Block', {
      props: {
        'data-testid': 'options',
      },
      exact: true,
    })
      .react('IconButton', {
        props: { id: 'options', group: 'main' },
      })
      .click();
  });

  it('should render successfully', () => {
    cy.getReact('OptionsPanel').should('exist');
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
      .getReact('OptionsPanel')
      .should('exist');
  });

  it('should render Header component', () => {
    cy.getReact('OptionsPanel')
      .getReact('Header')
      .should('exist');
  });

  it('should render Layout Options accordion', () => {
    cy.getReact('OptionsPanel')
      .getReact('Accordion', {
        props: { 'data-testid': 'options-panel:layout-options' },
      })
      .should('exist');
  });

  it('should render Node Styles accordion', () => {
    cy.getReact('OptionsPanel')
      .getReact('Accordion', {
        props: { 'data-testid': 'options-panel:layout-options' },
      })
      .should('exist');
  });

  it('should render Edge Styles accordion', () => {
    cy.getReact('OptionsPanel')
      .getReact('Accordion', {
        props: { 'data-testid': 'options-panel:node-styles' },
      })
      .should('exist');
  });

  it('should render Edge Styles accordion', () => {
    cy.getReact('OptionsPanel')
      .getReact('Accordion', {
        props: { 'data-testid': 'options-panel:edge-styles' },
      })
      .should('exist');
  });
});
