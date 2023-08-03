import { SampleData } from '../../../../src/containers/ImportWizardModal/SampleData';

describe('Import Circle Graph', () => {
  const graphinEl = 'Graphin2';
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import Circle Graph successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking random graph
    cy.importSampleData(SampleData.CIRCLE_GRAPH);

    // waiting for loading indicator to dissappear
    cy.wait(500);
  });

  it('should display layout in Concentric', () => {
    cy.getReact(graphinEl)
      .getProps('layout.type')
      .should('deep.eq', 'concentric');
  });

  it('should render 18 edges in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 18);
  });

  it('should render 10 nodes in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 10);
  });

  it('should display 10 nodes count in Nodes label', () => {
    cy.get('div[data-testid="nodes-count"]').should('have.text', '10/10');
  });

  it('should display 18 edges count in Edges label', () => {
    cy.get('div[data-testid="edges-count"]').should('have.text', '18/18');
  });

  it('should display one row for data list', () => {
    cy.getReact('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    }).should('have.length', 1);
  });

  it('should display data list name [Circle Data]', () => {
    cy.getReact('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    })
      .getProps('title')
      .should('deep.eq', 'Circle Data');
  });
});
