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
    cy.getOptionsPanel().should('exist');
  });

  describe('Layout Options', () => {
    it('should render Layout Options', () => {
      cy.getOptionsPanel().getReact('OptionsLayout').should('exist');
    });

    it('should possess one layout nested form', () => {
      cy.getOptionsPanel()
        .getReact('OptionsLayout')
        .getReact('Card', {
          props: {
            'data-testid': 'OptionsLayout',
          },
        })
        .getReact('NestedForm')
        .should('exist')
    });
  });

  describe('Node Style Options', () => {

    before(() => {
      cy.switchTab('nodes');
    });

    it('should render Node Style Options', () => {
      cy.getOptionsPanel().getReact('OptionsNodeStyles').should('exist');
    });

    it('should possess forms', () => {
      cy.getOptionsPanel()
        .getReact('OptionsNodeStyles')
        .getReact('Card', {
          props: {
            'data-testid': 'OptionsNodeStyles',
          },
        })
        .getReact('NestedForm')
        .should('exist')
    });
  });

  describe('Edge Style Options', () => {

    before(() => {
      cy.switchTab('edges');
    });

    it('should render Edge Style Filter', () => {
      cy.getOptionsPanel().getReact('OptionsEdgeStyles').should('exist');
    });

    it('should possess forms', () => {
      cy.getOptionsPanel()
        .getReact('OptionsEdgeStyles')
        .getReact('Card', {
          props: {
            'data-testid': 'OptionsEdgeStyles',
          },
        })
        .getReact('NestedForm')
        .should('exist')
    });
  });
});
