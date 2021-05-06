describe('Toolbar', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    cy.getReact('Toolbar').should('exist');
  });

  it('should have eight icons button', () => {
    cy.react('Toolbar')
      .getReact('ToolbarButton')
      .should('have.length', 8);
  });

  it('should render on top right position and flex column direction', () => {
    cy.react('TopRightLayer')
      .getReact('Toolbar')
      .should('exist');
  });

  it('should render legend button successfully', () => {
    cy.getReact('ToolbarButton', {
      props: { item: { name: 'Legend' } },
    }).should('exist');
  });
});
