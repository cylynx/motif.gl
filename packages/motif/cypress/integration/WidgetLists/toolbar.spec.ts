describe('Toolbar', () => {
  const getToolbar = () => {
    return cy.react('Block', {
      props: {
        'data-testid': 'toolbar',
      },
    });
  };

  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    getToolbar().should('exist');
  });

  it('should have eight icons button', () => {
    getToolbar().getReact('ToolbarButton').should('have.length', 8);
  });

  it('should render legend button successfully', () => {
    cy.getReact('ToolbarButton', {
      props: { item: { name: 'Legend' } },
    }).should('exist');
  });
});
