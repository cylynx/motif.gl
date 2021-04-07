import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Interactions', () => {
  const graphinEl = 'Graphin';
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking bank
    cy.importSampleData(SampleData.BANK);

    // switch to filter panel
    cy.switchPanel('filters');
    cy.react('AddFilterButton').click();
  });

  it('should remain filters after switching panels', () => {
    // perform first selection
    cy.selectFilterSelection('icon{enter}', 'first');
    cy.filterMultiString('account_box{enter}');

    // toggle/switching layers
    cy.switchPanel('layers');
    cy.switchPanel('filters');

    // results
    cy.getReact(graphinEl)
      .getProps('data.nodes')
      .should('have.length', 7);
    cy.getReact(graphinEl)
      .getProps('data.edges')
      .should('have.length', 0);
  });

  it('should remain filters are adding data', () => {
    cy.switchPanel('layers');
    cy.react('ImportDataButton').click();

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import another sample data
    cy.react('Cell', {
      props: { 'data-testid': SampleData.CIRCLE_GRAPH },
    })
      .find('Button')
      .click();

    // switch back to filters
    cy.switchPanel('filters');

    // results
    cy.getReact(graphinEl)
      .getProps('data.nodes')
      .should('have.length', 7);
    cy.getReact(graphinEl)
      .getProps('data.edges')
      .should('have.length', 0);
  });

  it('should remain filters after remove one data', () => {
    cy.switchPanel('layers');

    // remove circular graph data
    cy.react('DeleteButton')
      .last()
      .click();

    // switch back to filters
    cy.switchPanel('filters');

    // results
    cy.getReact(graphinEl)
      .getProps('data.nodes')
      .should('have.length', 7);
    cy.getReact(graphinEl)
      .getProps('data.edges')
      .should('have.length', 0);
  });

  it('should remove filters once all data are cleared', () => {
    cy.switchPanel('layers');

    // clear all datas
    cy.react('ClearDataButton').click();

    // switch back to filters
    cy.switchPanel('filters');

    // all filters are removed and add filter button is disabled
    cy.getReact('FilterPanel')
      .getReact('AddFilterButton')
      .getProps('disabled')
      .should('deep.eq', true);
  });
});
