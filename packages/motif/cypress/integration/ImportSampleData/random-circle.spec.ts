import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Import Random + Circle', () => {
  const graphinEl = 'Graphin2';
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Random + Circle successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.importSampleData(SampleData.SIMPLE_GRAPH);

    // waiting for loading indicator to dissappear
    cy.wait(500);
  });

  it('should display layout in Concentric', () => {
    cy.getReact(graphinEl)
      .getProps('layout.type')
      .should('deep.eq', 'concentric');
  });

  it('should render 25 edges in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 25);
  });

  it('should render 15 nodes in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 15);
  });

  it('should display 15 nodes count in Nodes label', () => {
    cy.get('div[data-testid="nodes-count"]').should('have.text', '15/15');
  });

  it('should display 25 edges count in Edges label', () => {
    cy.get('div[data-testid="edges-count"]').should('have.text', '25/25');
  });

  it('should display two row for data list', () => {
    cy.getReact('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    }).should('have.length', 2);
  });

  it('should display data list name [Random Data]', () => {
    cy.getReact('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    })
      .nthNode(1)
      .getProps('title')
      .should('deep.eq', 'Random Data');
  });

  it('should display data list name [Circle Data]', () => {
    cy.getReact('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    })
      .nthNode(0)
      .getProps('title')
      .should('deep.eq', 'Circle Data');
  });
});
