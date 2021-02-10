/// <reference types="cypress" />

type FilterSelectionType = 'first' | 'last' | null;
declare namespace Cypress {
  interface Chainable {
    switchTab(tabActiveKey: string): void;
    selectFilterSelection(text: string, type?: FilterSelectionType): void;
    filterMultiString(text: string, type?: FilterSelectionType): void;
    switchPanel(type: string): void;
    importSampleData(type: any): void;
  }
}

const switchTab = (tabActiveKey: string) => {
  cy.react('Tabs')
    .react('InternalTab', {
      props: { childKey: tabActiveKey },
    })
    .click();
};

const selectFilterSelection = (
  text: string,
  type: FilterSelectionType = null,
): void => {
  const filterSelectionVariable = cy
    .react('FilterSelection')
    .react('Header')
    .react('SelectVariable', {
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
  const filterMultiString = cy
    .react('FilterSelection')
    .react('StringSelect', {
      props: {
        'data-testid': 'filter-selection:string-select',
      },
    })
    .react('MultiStringSelect');

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
  })
    .find('Button')
    .click();
};

Cypress.Commands.add('switchTab', switchTab);
Cypress.Commands.add('selectFilterSelection', selectFilterSelection);
Cypress.Commands.add('filterMultiString', filterMultiString);
Cypress.Commands.add('switchPanel', switchPanel);
Cypress.Commands.add('importSampleData', importSampleData);
