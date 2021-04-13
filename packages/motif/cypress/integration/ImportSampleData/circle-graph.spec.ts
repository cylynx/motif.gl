import { SampleData } from '../../../packages/src/containers/ImportWizardModal/SampleData';

describe('Import Circle Graph', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Circle Graph successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.CIRCLE_GRAPH },
    })
      .find('Button')
      .click();
  });

  it('should display layout in Concentric', () => {
    cy.getReact('Graphin')
      .getProps('layout.type')
      .should('deep.eq', 'concentric');
  });

  it('should render 18 edges in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.edges')
      .should('have.length', 18);
  });

  it('should render 10 nodes in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.nodes')
      .should('have.length', 10);
  });

  it('should display 10 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 10);
  });

  it('should display 18 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 18);
  });

  it('should display one row for data list', () => {
    cy.getReact('DataListAccordion')
      .getProps('items')
      .should('have.length', 1);
  });

  it('should display data list name [Circle Data]', () => {
    cy.getReact('AccordionPanel')
      .nthNode(0)
      .getProps('title')
      .should('deep.eq', 'Circle Data');
  });
});
