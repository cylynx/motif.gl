import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('String Filters', () => {
  const graphinEl = 'Graphin';
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact(5000);

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking circle graph
    cy.importSampleData(SampleData.CIRCLE_GRAPH);
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
      cy.selectFilterSelection('data.label{enter}', 'first');
      cy.filterMultiString('node-0{enter}');

      // switch to layer panel
      cy.switchPanel('layers');

      // possess only one edge and one node
      cy.getReact(graphinEl)
        .getProps('data.nodes')
        .should('have.length', 1);

      cy.getReact(graphinEl)
        .getProps('data.edges')
        .should('have.length', 1);
    });

    it('should perform filter with multi variable', () => {
      // perform selection
      cy.selectFilterSelection('data.label{enter}', 'first');
      cy.filterMultiString('node-0{enter}node-1{enter}');

      // switch to layer panel
      cy.switchPanel('layers');

      // possess three edges and two nodes
      cy.getReact(graphinEl)
        .getProps('data.nodes')
        .should('have.length', 2);

      cy.getReact(graphinEl)
        .getProps('data.edges')
        .should('have.length', 3);
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
      cy.getReact(graphinEl)
        .getProps('data.nodes')
        .should('have.length', 2);

      cy.getReact(graphinEl)
        .getProps('data.edges')
        .should('have.length', 1);
    });

    it('should perform filter with multi variable', () => {
      // perform selection
      cy.selectFilterSelection('source{enter}', 'first');
      cy.filterMultiString('node-1{enter}node-0{enter}');

      // switch to layer panel
      cy.switchPanel('layers');

      // possess three edges and two nodes
      cy.getReact(graphinEl)
        .getProps('data.nodes')
        .should('have.length', 9);

      cy.getReact(graphinEl)
        .getProps('data.edges')
        .should('have.length', 10);
    });
  });
});
