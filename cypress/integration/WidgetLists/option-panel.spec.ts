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

  it('should render Layout Options accordion', () => {
    cy.getReact('OptionsPanel')
      .getReact('OptionsLayout')
      .should('exist');
  });

  it('should render Node Styles accordion', () => {
    cy.getReact('OptionsPanel')
      .getReact('OptionsNodeStyles')
      .should('exist');
  });

  it('should render Edge Styles accordion', () => {
    cy.getReact('OptionsPanel')
      .getReact('OptionsEdgeStyles')
      .should('exist');
  });
});
