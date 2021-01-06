/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Multiple Selection', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact();

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking bank
    cy.react('Cell', {
      props: { 'data-testid': SampleData.BANK },
    })
      .find('Button')
      .click();
  });

  describe('Double Strings filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.react('Block', {
        props: {
          'data-testid': 'filters',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'filters', group: 'main' },
        })
        .click();

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Single - Single combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('icon{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('account_box{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('id{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .last()
        .type('customer_81{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });

    it('Multiple - Single combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('icon{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('account_box{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('id{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .last()
        .type('customer_81{enter}')
        .type('customer_55{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });

    it('Multiple - Multiple combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('customer_type{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('retail{enter}')
        .type('-{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('id{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .last()
        .type('customer_81{enter}')
        .type('customer_55{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Triple Strings filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.react('Block', {
        props: {
          'data-testid': 'filters',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'filters', group: 'main' },
        })
        .click();

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Double - Double - Double combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('customer_type{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .type('retail{enter}')
        .type('-{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('id{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .last()
        .type('customer_81{enter}')
        .type('customer_55{enter}');

      // perform third selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('icon{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .last()
        .type('account_box{enter}')
        .type('-{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Numeric and String filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.react('Block', {
        props: {
          'data-testid': 'filters',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'filters', group: 'main' },
        })
        .click();

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Numeric - Single String combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('risk_score{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('id{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .last()
        .type('customer_901{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });

    it('Numeric - Double String combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('risk_score{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('id{enter}');

      cy.react('FilterSelection')
        .react('StringSelect', {
          props: {
            'data-testid': 'filter-selection:string-select',
          },
        })
        .react('MultiStringSelect')
        .last()
        .type('customer_901{enter}')
        .type('customer_902{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Numeric and Numeric filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.react('Block', {
        props: {
          'data-testid': 'filters',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'filters', group: 'main' },
        })
        .click();

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Double Numeric combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('amount{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('is_different_bank{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
    });

    it('Triple Numeric combination', () => {
      // perform first selection
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .first()
        .type('amount{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('is_different_bank{enter}');

      // perform last selection
      cy.react('AddFilterButton').click();
      cy.react('FilterSelection')
        .react('Header')
        .react('SelectVariable', {
          props: {
            'data-testid': 'filter-selection-header:select-variable',
          },
        })
        .last()
        .type('risk_score{enter}');

      // switch to layer panel
      cy.react('Block', {
        props: {
          'data-testid': 'layers',
        },
        exact: true,
      })
        .react('IconButton', {
          props: { id: 'layers', group: 'main' },
        })
        .click();

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 0);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  it('Numeric - Single String combination', () => {
    // perform first selection
    cy.react('FilterSelection')
      .react('Header')
      .react('SelectVariable', {
        props: {
          'data-testid': 'filter-selection-header:select-variable',
        },
      })
      .first()
      .type('risk_score{enter}');

    // perform second selection
    cy.react('AddFilterButton').click();
    cy.react('FilterSelection')
      .react('Header')
      .react('SelectVariable', {
        props: {
          'data-testid': 'filter-selection-header:select-variable',
        },
      })
      .last()
      .type('id{enter}');

    cy.react('FilterSelection')
      .react('StringSelect', {
        props: {
          'data-testid': 'filter-selection:string-select',
        },
      })
      .react('MultiStringSelect')
      .last()
      .type('customer_901{enter}');

    // switch to layer panel
    cy.react('Block', {
      props: {
        'data-testid': 'layers',
      },
      exact: true,
    })
      .react('IconButton', {
        props: { id: 'layers', group: 'main' },
      })
      .click();

    // results
    cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

    cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
  });
});
