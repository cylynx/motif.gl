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
    cy.switchPanel('filters');

    cy.react('AddFilterButton').click();
  });

  afterEach(() => {
    cy.react('ClearDataButton').click();
  });

  it('should filter with Numeric Variable', () => {
    // perform selection
    cy.selectFilterSelection('risk_score{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 7);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
  });

  it('should filter with DateTime Variable', () => {
    // perform selection
    cy.selectFilterSelection('create_date{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
  });

  it('should filter with Date Variable', () => {
    // perform selection
    cy.selectFilterSelection('date{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
  });

  it('should filter with Time Variable', () => {
    // perform selection
    cy.selectFilterSelection('time{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);
    cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
  });
});
