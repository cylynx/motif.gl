describe('Variable Inspector', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    cy.getReact('Select', {
      props: {
        'data-testid': 'select-variable',
      },
    }).should('exist');
  });

  it('should have no value on initialisation', () => {
    cy.getReact('SelectVariable').getProps('value').should('have.length', 0);
  });
});
