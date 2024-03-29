import { SampleData } from '../../../../src/containers/ImportWizardModal/SampleData';

describe('Interactions', () => {
  const graphinEl = 'Graphin2';
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
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 7);
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
  });

  it('should remain filters when adding data', () => {
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
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 7);
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
  });

  it('should remain filters after one data is removed', () => {
    cy.switchPanel('layers');

    // remove circular graph data
    cy.react('DeleteButton$1').first().click();

    // switch back to filters
    cy.switchPanel('filters');

    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 7);
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
  });

  // TODO: Add back when clear data button is implemented
  // it('should remove filters once all data are cleared', () => {
  //   cy.switchPanel('layers');

  //   // clear all datas
  //   cy.react('ClearDataButton').click();

  //   // switch back to filters
  //   cy.switchPanel('filters');

  //   // all filters are removed and add filter button is disabled
  //   cy.getReact('AddFilterButton').getProps('disabled').should('deep.eq', true);
  // });
});
