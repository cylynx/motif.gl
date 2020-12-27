/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    switchTab(tabActiveKey: string): void;
  }
}

const switchTab = (tabActiveKey: string) => {
  cy.react('Tabs')
    .react('InternalTab', {
      props: { childKey: tabActiveKey },
    })
    .click();
};

Cypress.Commands.add('switchTab', switchTab);
