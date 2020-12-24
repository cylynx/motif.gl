/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import { DndItem } from '../../../src/components/DndList';

describe('Import Random Graphs', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Random Graph successfully', () => {
    // switch tabs to sample data
    cy.react('Tabs')
      .react('InternalTab', {
        props: { childKey: 'sample-data' },
      })
      .click();

    // import sample data by clicking random graph
    cy.react('Cell', {
      props: { 'data-testid': SampleData.RANDOM_GRAPH },
    })
      .find('Button')
      .click();
  });

  it('should display layout in Concentric', () => {
    cy.getReact('Graph')
      .getProps('layout.name')
      .should('deep.eq', 'concentric');
  });

  it('should render 7 edges in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.edges')
      .should('have.length', 7);
  });

  it('should render 15 nodes in Graphin', () => {
    cy.getReact('Graph')
      .getProps('data.nodes')
      .should('have.length', 15);
  });

  it('should display 15 nodes count in Nodes label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'nodes-count' },
    })
      .getProps('value')
      .should('deep.eq', 15);
  });

  it('should display 7 edges count in Edges label', () => {
    cy.getReact('Statistic', {
      props: { 'data-testid': 'edges-count' },
    })
      .getProps('value')
      .should('deep.eq', 7);
  });

  it('should display one row for data list', () => {
    cy.getReact('DndList')
      .getProps('items')
      .should('have.length', 1);
  });

  it('should display data list name [Random Data]', () => {
    cy.getReact('DndList')
      .getProps('items')
      .should(($els: DndItem[]) => {
        const isRandomDataExist = $els.find((el) => el.title === 'Random Data');
        expect(isRandomDataExist.isVisible).to.be.true;
      });
  });
});
