describe('Search Panel', function() {
  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);

    // close modal
    cy.get('button[aria-label="Close"]').click();

    // open filter panels by clicking sidebar
    cy.switchPanel('search');
  });

  it('should render successfully', () => {
    cy.getReact('SearchPanel').should('exist');
  });

  it('should render beside Left Navigation Bar', () => {
    cy.getReact('LeftLayer')
      .getReact('SearchPanel')
      .should('exist');
  });

  it('should render beside Left Navigation Bar', () => {
    cy.getReact('LeftLayer')
      .getReact('SearchPanel')
      .should('exist');
  });

  it('should render Search Tabs successfully', () => {
    cy.getReact('SearchTabs').should('exist');
  });

  it('should not render ItemResults without data', () => {
    cy.getReact('ItemResults').should('not.exist');
  });

  it('should not render ItemPagination without data', () => {
    cy.getReact('ItemPagination').should('not.exist');
  });
});
