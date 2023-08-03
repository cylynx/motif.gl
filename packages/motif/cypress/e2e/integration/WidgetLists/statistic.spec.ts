describe('Statistic', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    cy.react('GraphStatistics').should('exist');
  });

  it('should have node and edge statistics', () => {
    cy.get('div[data-testid="nodes-count"]').should('exist');
    cy.get('div[data-testid="edges-count"]').should('exist');
  });

  it('nodes and edges statistic should initialize with zero', () => {

    cy.get('div[data-testid="nodes-count"]').should('have.text', '0/0');
    cy.get('div[data-testid="edges-count"]').should('have.text', '0/0');
  });
});