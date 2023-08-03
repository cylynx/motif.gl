import { SampleData } from '../../../../src/containers/ImportWizardModal/SampleData';

describe('Import Authorship', () => {
  const graphinEl = 'Graphin2';
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

    cy.wait(4500);
  });

  it('should display layout as x y coordinate', () => {
    cy.getReact(graphinEl).getProps('layout.type').should('deep.eq', 'preset');
  });

  it('should render 2742 edges in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 2742);
  });

  it('should render 1589 nodes in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 1589);
  });

  it('should display 1589 nodes count in Nodes label', () => {
    cy.get('div[data-testid="nodes-count"]').should('have.text', '1589/1589');
  });

  it('should display 2742 edges count in Edges label', () => {
    cy.get('div[data-testid="edges-count"]').should('have.text', '2742/2742');
  });
});
