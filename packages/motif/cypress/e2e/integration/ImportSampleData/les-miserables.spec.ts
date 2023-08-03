import { SampleData } from '../../../../src/containers/ImportWizardModal/SampleData';

describe('Import Les Misérables', () => {
  const graphinEl = 'Graphin2';
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
    cy.getReact(graphinEl)
      .getProps('layout.type')
      .should('deep.eq', 'concentric');
  });

  it('should render 254 edges in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 254);
  });

  it('should render 77 nodes in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 77);
  });

  it('should display 77 nodes count in Nodes label', () => {
    cy.get('div[data-testid="nodes-count"]').should('have.text', '77/77');
  });

  it('should display 254 edges count in Edges label', () => {
    cy.get('div[data-testid="edges-count"]').should('have.text', '254/254');
  });

  it('should display one row for data list', () => {
    cy.getReact('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    }).should('have.length', 1);
  });

  it('should display data list name [Les Miserables]', () => {
    cy.getReact('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    })
      .getProps('title')
      .should('deep.eq', 'Les Miserables');
  });
});
