/// <reference types="cypress" />
import 'cypress-react-selector';

export default describe('Import Sample Data', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('Modal should open when the page is loaded.', () => {
    cy.getReact('Modal')
      .getProps('isOpen')
      .should('eq', true);
  });

  it('Import Random Graph successfully', () => {
    cy.getReact('Tabs').debug();
  });
});
