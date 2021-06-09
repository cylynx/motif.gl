import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Import American Airlines', () => {
  const graphinEl = 'Graphin2';
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should import American Airlines successfully', () => {
    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data
    cy.importSampleData(SampleData.AA);

    cy.wait(3000);
  });

  it('should display layout as x y coordinate', () => {
    cy.getReact(graphinEl).getProps('layout.type').should('deep.eq', 'preset');
  });

  it('should render 1298 edges in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.edges').should('have.length', 1298);
  });

  it('should render 235 nodes in Graphin', () => {
    cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 235);
  });

  it('should display 235 nodes count in Nodes label', () => {
    cy.get('div[data-testid="nodes-count"]').should('have.text', '235/235');
  });

  it('should display 1298 edges count in Edges label', () => {
    cy.get('div[data-testid="edges-count"]').should('have.text', '1298/1298');
  });
});
