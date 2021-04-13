import { SampleData } from '../../../packages/src/containers/ImportWizardModal/SampleData';

describe('Import Authorship', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Authorship successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.NETWORK },
    })
      .find('Button')
      .click();

    cy.wait(4000);
  });

  it('should display layout as x y coordinate', () => {
    cy.getReact('Graphin')
      .getProps('layout.type')
      .should('deep.eq', 'preset');
  });

  it('should render 2742 edges in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.edges')
      .should('have.length', 2742);
  });

  it('should render 1589 nodes in Graphin', () => {
    cy.getReact('Graphin')
      .getProps('data.nodes')
      .should('have.length', 1589);
  });

  it('should display 1589 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 1589);
  });

  it('should display 2742 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .nthNode(0)
      .getProps('value')
      .should('deep.eq', 2742);
  });
});
