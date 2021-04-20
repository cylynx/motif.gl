import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('String Filters', () => {
  const graphinEl = 'Graphin2';

  const deleteButtonClick = () => {
    cy.react('Button', {
      props: {
        'data-testid': 'filter-selection-header:delete',
      },
    })
      .nthNode(0)
      .click();
  };

  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking circle graph
    cy.importSampleData(SampleData.CIRCLE_GRAPH);
    cy.switchPanel('filters');
  });

  describe('Filter with Node String Variable', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.wait(500);
      deleteButtonClick();
    });

    it('should perform filter with one variable', () => {
      // perform selection
      cy.selectFilterSelection('label{enter}', 'first');
      cy.filterMultiString('node-0{enter}');

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
      cy.selectFilterSelection('label{enter}', 'first');
      cy.filterMultiString('node-0{enter}node-1{enter}');

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
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.wait(500);
      deleteButtonClick();
    });

    it('should perform filter with one variable', () => {
      // perform selection
      cy.selectFilterSelection('source{enter}', 'first');
      cy.filterMultiString('node-1{enter}');

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
