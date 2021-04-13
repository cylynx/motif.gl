import { SampleData } from '../../../packages/src/containers/ImportWizardModal/SampleData';

describe('Import Les Misérables', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Les Misérables successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.MISERABLE },
    })
      .find('Button')
      .click();

    cy.wait(1000);
  });

  it('should display layout in Concentric', () => {
    cy.getReact('Graphin')
      .getProps('layout.type')
      .should('deep.eq', 'concentric');
  });

  it('should render 254 edges in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.edges')
      .should('have.length', 254);
  });

  it('should render 77 nodes in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.nodes')
      .should('have.length', 77);
  });

  it('should display 77 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 77);
  });

  it('should display 254 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 254);
  });

  it('should display one row for data list', () => {
    cy.getReact('DataListAccordion')
      .getProps('items')
      .should('have.length', 1);
  });

  it('should display data list name [Les Miserables]', () => {
    cy.getReact('AccordionPanel')
      .nthNode(0)
      .getProps('title')
      .should('deep.eq', 'Les Miserables');
  });
});
