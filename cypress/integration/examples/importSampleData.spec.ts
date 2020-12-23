/// <reference types="cypress" />
import 'cypress-react-selector';

export default describe('Import Sample Data', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  // it('Modal should open when the page is loaded.', () => {
  //   cy.getReact('Modal')
  //     .getProps('isOpen')
  //     .should('eq', true);
  // });

  it('Import Random Graph successfully', () => {
    // cy.react('Tabs')
    //   .get('[data-baseweb="tab-list"]')
    //   .get('#tabs-4-tab-sample-data')
    //   .click();

    cy.react('Tabs')
      .react('InternalTab', {
        props: { childKey: 'sample-data' },
      })
      .click();
  });
});
