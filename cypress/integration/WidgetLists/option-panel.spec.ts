describe('Option Panel', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);

    // close modal
    cy.get('button[aria-label="Close"]').click();

    // open option panels by clicking sidebar
    cy.switchPanel('options');
  });

  it('should render successfully', () => {
    cy.getReact('OptionsPanel').should('exist');
  });

  it('should render beside Left Navigation Bar', () => {
    cy.react('LeftLayer')
      .getReact('OptionsPanel')
      .should('exist');
  });

  it('should render Header component', () => {
    cy.getReact('OptionsPanel')
      .getReact('Header')
      .should('exist');
  });

  it('should render Layout Options', () => {
    cy.getReact('OptionsPanel')
      .getReact('OptionsLayout')
      .should('exist');
  });

  it('should render Node Style Filter', () => {
    cy.getReact('OptionsPanel')
      .getReact('OptionsNodeStyles')
      .should('exist');
  });

  it('should render Edge Style Filter', () => {
    cy.getReact('OptionsPanel')
      .getReact('OptionsEdgeStyles')
      .should('exist');
  });

  describe('Layout Options', () => {
    it('should possess one layout form', () => {
      cy.getReact('OptionsPanel')
        .getReact('OptionsLayout')
        .getReact('Accordion', {
          props: {
            'data-testid': 'OptionsLayout',
          },
        })
        .getProps('items.0')
        .then(($item) => {
          const { key, expanded } = $item;
          cy.wrap(key).should('deep.equal', 'layout');
          cy.wrap(expanded).should('deep.equal', true);
        });
    });
  });
});
