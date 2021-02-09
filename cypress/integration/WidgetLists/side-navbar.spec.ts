describe('Left Navigation Bar', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  it('should render successfully', () => {
    cy.getReact('Block', { props: { 'data-testid': 'side-navbar' } }).should(
      'exist',
    );
  });

  it('should position on left, display flex with column direction', () => {
    cy.getReact('Block', {
      props: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'fixed',
        top: '0%',
        left: '0%',
        width: '50px',
        height: '100%',
        paddingBottom: '20px',
        backgroundColor: 'backgroundSecondary',
        'data-testid': 'side-navbar',
      },
      exact: true,
    }).should('exist');
  });

  it('should contain a logo', () => {
    cy.get("[data-testid='side-navbar:logo']").should('exist');
  });

  it('should render layers and options button in top position', () => {
    cy.getReact('Block', {
      props: {
        'data-testid': 'layers',
      },
      exact: true,
    }).should('exist');

    cy.getReact('Block', {
      props: {
        'data-testid': 'options',
      },
      exact: true,
    }).should('exist');
  });

  it('should render toolbar and inspector icons button in bottom position', () => {
    cy.getReact('Block', {
      props: {
        'data-testid': 'toolbar',
      },
      exact: true,
    }).should('exist');

    cy.getReact('Block', {
      props: {
        'data-testid': 'inspector',
      },
      exact: true,
    }).should('exist');
  });
});
