/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Import American Airlines', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Les Misérables successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.AA },
    })
      .find('Button')
      .click();

    cy.wait(4000);
  });

  it('should display layout as x y coordinate', () => {
    cy.getReact('Graph')
      .getProps('layout.name')
      .should('deep.eq', 'none');
  });

  it('should render 1298 edges in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.edges')
      .should('have.length', 1298);
  });

  it('should render 235 nodes in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.nodes')
      .should('have.length', 235);
  });

  it('should display 235 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .getProps('value')
      .should('deep.eq', 235);
  });

  it('should display 1298 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .getProps('value')
      .should('deep.eq', 1298);
  });
});
