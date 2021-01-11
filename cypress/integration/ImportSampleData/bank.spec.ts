/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import { DndItem } from '../../../src/components/DndList';

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

    cy.wait(500);
  });

  it('should display layout in Concentric', () => {
    cy.getReact('Graph')
      .getProps('layout.name')
      .should('deep.eq', 'concentric');
  });

  it('should render 23 edges in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.edges')
      .should('have.length', 23);
  });

  it('should render 17 nodes in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.nodes')
      .should('have.length', 17);
  });

  it('should display 17 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .getProps('value')
      .should('deep.eq', 17);
  });

  it('should display 23 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .getProps('value')
      .should('deep.eq', 23);
  });

  it('should display one row for data list', () => {
    cy.getReact('DndList')
      .getProps('items')
      .should('have.length', 1);
  });

  it('should display data list name [banking-connections]', () => {
    cy.getReact('DndList')
      .getProps('items')
      .should(($els: DndItem[]) => {
        const isRandomDataExist = $els.find(
          (el: DndItem) => el.title === 'Banking Connections',
        );
        expect(isRandomDataExist.isVisible).to.be.true;
      });
  });
});
