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

  it('should render at bottom right position', () => {
    cy.react('Block', {
      props: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '500px',
        backgroundColor: 'backgroundTertiary',
        paddingTop: 'scale600',
        paddingLeft: 'scale600',
        paddingRight: 'scale600',
      },
      exact: true,
    })
      .getReact('Select')
      .should('exist');
  });

  it('should have no value on initialisation', () => {
    cy.getReact('SelectVariable').getProps('value').should('have.length', 0);
  });
});
