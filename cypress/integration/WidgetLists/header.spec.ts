/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Header', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // // close modal
    // cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    cy.getReact('ImportLayers')
      .getReact('Header')
      .should('exist');
  });

  it('should not display screenshot button without graph list', () => {
    cy.react('ImportLayers')
      .react('Header')
      .react('HeaderButton', {
        props: {
          name: 'Screenshot',
        },
      })
      .should('not.exist');
  });

  it('should not display export button without graph list', () => {
    cy.react('ImportLayers')
      .react('Header')
      .react('HeaderButton', {
        props: {
          name: 'Save',
        },
      })
      .should('not.exist');
  });

  it('should display screenshot button with graph list', () => {
    // switch tab and import a sample data
    cy.switchTab('sample-data');

    // import random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.BANK },
    })
      .find('Button')
      .click();

    cy.react('ImportLayers')
      .react('Header')
      .react('HeaderButton', {
        props: {
          name: 'Screenshot',
        },
      })
      .should('exist');
  });

  it('should display export button with graph list', () => {
    cy.react('ImportLayers')
      .react('Header')
      .react('HeaderButton', {
        props: {
          name: 'Save',
        },
      })
      .should('exist');
  });
});