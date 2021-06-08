/// <reference types="cypress" />

type FilterSelectionType = 'first' | 'last' | null;
declare namespace Cypress {
  interface Chainable {
    switchTab(tabActiveKey: string): void;
    selectFilterSelection(text: string, type?: FilterSelectionType): void;
    filterMultiString(text: string, type?: FilterSelectionType): void;
    switchPanel(type: string): void;
    importSampleData(type: any): void;
    getFilterPanel(): Chainable<any>;
    getLayerPanel(): Chainable<any>;
    getOptionsPanel(): Chainable<any>;
    getSearchPanel(): Chainable<any>;
  }
}

const switchTab = (tabActiveKey: string) => {
  cy.react('Tabs$1')
    .react('InternalTab', {
      props: { childKey: tabActiveKey },
    })
    .click();
};

const selectFilterSelection = (
  text: string,
  type: FilterSelectionType = null,
): void => {
  const filterSelectionVariable = cy.react('SelectVariable', {
    props: {
      'data-testid': 'filter-selection-header:select-variable',
    },
  });

  if (type === 'first') {
    filterSelectionVariable.first();
  }

  if (type === 'last') {
    filterSelectionVariable.last();
  }

  filterSelectionVariable.type(text);
};

const filterMultiString = (
  text: string,
  type: FilterSelectionType = null,
): void => {
  const filterMultiString = cy.react('BatchSingleSelect');

  if (type === 'first') {
    filterMultiString.first();
  }

  if (type === 'last') {
    filterMultiString.last();
  }

  filterMultiString.type(text);
};

const switchPanel = (type: string) => {
  cy.react('Block', {
    props: {
      'data-testid': type,
    },
    exact: true,
  })
    .react('IconButton', {
      props: { id: type, group: 'main' },
    })
    .click();
};

const importSampleData = (type: any) => {
  cy.react('Cell', {
    props: { 'data-testid': type },
  }).click();
};

const getFilterPanel = () => {
  return cy.react('Block', {
    props: {
      'data-testid': 'filter-panel',
    },
  });
};

const getLayerPanel = () => {
  return cy.react('Block', {
    props: {
      'data-testid': 'layers-panel',
    },
  });
};

const getOptionsPanel = () => {
  return cy.react('Block', {
    props: {
      'data-testid': 'options-panel',
    },
  });
};

const getSearchPanel = () => {
  return cy.react('Block', {
    props: {
      'data-testid': 'search-panel',
    },
  });
};

Cypress.Commands.add('switchTab', switchTab);
Cypress.Commands.add('selectFilterSelection', selectFilterSelection);
Cypress.Commands.add('filterMultiString', filterMultiString);
Cypress.Commands.add('switchPanel', switchPanel);
Cypress.Commands.add('importSampleData', importSampleData);
Cypress.Commands.add('getFilterPanel', getFilterPanel);
Cypress.Commands.add('getLayerPanel', getLayerPanel);
Cypress.Commands.add('getOptionsPanel', getOptionsPanel);
Cypress.Commands.add('getSearchPanel', getSearchPanel);

// This error means that ResizeObserver was not able to deliver all observations
// within a single animation frame, the Cypress maintainer propose this solution
// to ignore the errors.
// https://stackoverflow.com/a/63519375
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err: Error) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});
