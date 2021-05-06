import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Import Bank Connections', () => {
  const graphinEl = 'Graphin2';
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Bank connections successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking bank datasets
    cy.importSampleData(SampleData.BANK);

    // waiting for loading indicator to dissappear
    cy.wait(500);
  });

  it('should display layout in Concentric', () => {
    cy.getReact(graphinEl)
      .getProps('layout.type')
      .should('deep.eq', 'concentric');
  });

  it('should render 23 edges in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 23);
  });

  it('should render 17 nodes in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 17);
  });

  it('should display 17 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 17);
  });

  it('should display 23 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 23);
  });

  it('should display one row for data list', () => {
    cy.getReact('DataListAccordion').getProps('items').should('have.length', 1);
  });

  it('should display data list name [Banking Connections]', () => {
    cy.getReact('AccordionPanel')
      .nthNode(0)
      .getProps('title')
      .should('deep.eq', 'Banking Connections');
  });
});
