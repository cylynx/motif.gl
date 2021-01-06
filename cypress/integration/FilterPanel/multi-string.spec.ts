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
      cy.switchPanel('filters');
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('should perform filter with one variable', () => {
      // perform selection
      cy.selectFilterSelection('label{enter}', 'first');
      cy.filterMultiString('node-node-0{enter}');

      // switch to layer panel
      cy.switchPanel('layers');

      // possess only one edge and one node
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 1);
    });

    it('should perform filter with multi variable', () => {
      // perform selection
      cy.selectFilterSelection('label{enter}', 'first');
      cy.filterMultiString('node-node-0{enter}node-node-1{enter}');

      // switch to layer panel
      cy.switchPanel('layers');

      // possess three edges and two nodes
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 3);
    });
  });

  describe('Filter with Edge String Variable', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('filters');

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('should perform filter with one variable', () => {
      // perform selection
      cy.selectFilterSelection('source{enter}', 'first');
      cy.filterMultiString('node-1{enter}');

      // switch to layer panel
      cy.switchPanel('layers');

      // possess only one edge and two nodes
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 1);
    });

    it('should perform filter with multi variable', () => {
      // perform selection
      cy.selectFilterSelection('source{enter}', 'first');
      cy.filterMultiString('node-1{enter}node-0{enter}');

      // switch to layer panel
      cy.switchPanel('layers');

      // possess three edges and two nodes
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 10);
    });
  });
});
