/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import { DndItem } from '../../../src/components/DndList';

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

    cy.wait(2000);
  });

  it('should display layout in Concentric', () => {
    cy.getReact('Graph')
      .getProps('layout.name')
      .should('deep.eq', 'concentric');
  });

  it('should render 254 edges in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.edges')
      .should('have.length', 254);
  });

  it('should render 77 nodes in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.nodes')
      .should('have.length', 77);
  });

  it('should display 77 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .getProps('value')
      .should('deep.eq', 77);
  });

  it('should display 254 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .getProps('value')
      .should('deep.eq', 254);
  });

  it('should display one row for data list', () => {
    cy.getReact('DndList')
      .getProps('items')
      .should('have.length', 1);
  });

  it('should display data list name [Les Miserables]', () => {
    cy.getReact('DndList')
      .getProps('items')
      .should(($els: DndItem[]) => {
        const isRandomDataExist = $els.find(
          (el) => el.title === 'Les Miserables',
        );
        expect(isRandomDataExist.isVisible).to.be.true;
      });
  });
});
