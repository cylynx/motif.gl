import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Histogram Filters', () => {
  const graphinEl: string = 'Graphin2';
  beforeEach(() => {
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

  afterEach(() => {
    cy.react('ClearDataButton').click();
  });

  it('should filter with Numeric Variable', () => {
    // perform selection
    cy.selectFilterSelection('risk_score{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact(graphinEl)
      .getProps('data.nodes')
      .should('have.length', 7);
    cy.getReact(graphinEl)
      .getProps('data.edges')
      .should('have.length', 0);
  });

  it('should filter with DateTime Variable', () => {
    // perform selection
    cy.selectFilterSelection('create_date{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact(graphinEl)
      .getProps('data.nodes')
      .should('have.length', 9);
    cy.getReact(graphinEl)
      .getProps('data.edges')
      .should('have.length', 14);
  });

  it('should filter with Date Variable', () => {
    // perform selection
    cy.selectFilterSelection('date{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact(graphinEl)
      .getProps('data.nodes')
      .should('have.length', 9);
    cy.getReact(graphinEl)
      .getProps('data.edges')
      .should('have.length', 14);
  });

  it('should filter with Time Variable', () => {
    // perform selection
    cy.selectFilterSelection('time{enter}', 'first');

    // switch to layer panel
    cy.switchPanel('layers');

    // results
    cy.getReact(graphinEl)
      .getProps('data.nodes')
      .should('have.length', 9);
    cy.getReact(graphinEl)
      .getProps('data.edges')
      .should('have.length', 14);
  });
});
