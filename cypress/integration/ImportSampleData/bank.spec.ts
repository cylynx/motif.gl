import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import { AccordionItem } from '../../../src/components/Accordion';

describe('Import Bank Connections', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Bank connections successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.BANK },
    })
      .find('Button')
      .click();
  });

  it('should display layout in Concentric', () => {
    cy.getReact('Graphin')
      .getProps('layout.type')
      .should('deep.eq', 'concentric');
  });

  it('should render 23 edges in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.edges')
      .should('have.length', 23);
  });

  it('should render 17 nodes in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.nodes')
      .should('have.length', 17);
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
    cy.getReact('DataListAccordion')
      .getProps('items')
      .should('have.length', 1);
  });

  it('should display data list name [Banking Connections]', () => {
    cy.getReact('AccordionPanel')
      .nthNode(0)
      .getProps('title')
      .should('deep.eq', 'Banking Connections');
  });
});
