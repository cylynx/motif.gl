/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Multiple Selection', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForReact(5000);

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
      cy.switchPanel('filters');
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Single - Single combination', () => {
      // perform first selection
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_box{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'last');
      cy.filterMultiString('customer_81{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });

    it('Multiple - Single combination', () => {
      // perform first selection
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_box{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'last');
      cy.filterMultiString('customer_81{enter}customer_55{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });

    it('Multiple - Multiple combination', () => {
      // perform first selection
      cy.selectFilterSelection('customer_type{enter}', 'first');
      cy.filterMultiString('retail{enter}-{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'last');
      cy.filterMultiString('customer_81{enter}customer_55{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Triple Strings filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('filters');
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Double - Double - Double combination', () => {
      // perform first selection
      cy.selectFilterSelection('customer_type{enter}', 'first');
      cy.filterMultiString('retail{enter}-{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'last');
      cy.filterMultiString('customer_81{enter}customer_55{enter}', 'last');

      // perform third selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'last');
      cy.filterMultiString('account_box{enter}-{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Numeric and String filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('filters');

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Numeric - Single String combination', () => {
      // perform first selection
      cy.selectFilterSelection('risk_score{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'last');
      cy.filterMultiString('customer_901{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });

    it('Numeric - Double String combination', () => {
      // perform first selection
      cy.selectFilterSelection('risk_score{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'last');
      cy.filterMultiString('customer_901{enter}customer_902{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 2);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Numeric and Numeric filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('filters');

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Double Numeric combination', () => {
      // perform first selection
      cy.selectFilterSelection('amount{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('is_different_bank{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
    });

    it('Triple Numeric combination', () => {
      // perform first selection
      cy.selectFilterSelection('amount{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('is_different_bank{enter}', 'last');

      // perform third selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('risk_score{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 0);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Numeric and String filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('layers');

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Numeric - Single String combination', () => {
      // perform first selection
      cy.selectFilterSelection('risk_score{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'last');
      cy.filterMultiString('customer_901{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 1);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('String and DateTime filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('filters');
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Single String - DateTime combination', () => {
      // perform first selection
      cy.selectFilterSelection('create_date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'last');
      cy.filterMultiString('account_balance{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
    });

    it('Multi String - DateTime combination', () => {
      // perform first selection
      cy.selectFilterSelection('create_date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'last');
      cy.filterMultiString('account_box{enter}-{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 0);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 0);
    });
  });

  describe('String and Time filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('filters');

      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Single String - Time combination', () => {
      // perform first selection
      cy.selectFilterSelection('time{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'last');
      cy.filterMultiString('account_balance{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
    });

    it('Multi String - Time combination', () => {
      // perform first selection
      cy.selectFilterSelection('create_date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'last');
      cy.filterMultiString('account_balance{enter}-{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
    });
  });

  describe('String and Date filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.switchPanel('filters');
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      cy.react('ClearDataButton').click();
    });

    it('Single String - Date combination', () => {
      // perform first selection
      cy.selectFilterSelection('date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'last');
      cy.filterMultiString('account_balance{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
    });

    it('Multi String - Date combination', () => {
      // perform first selection
      cy.selectFilterSelection('date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'last');
      cy.filterMultiString('account_balance{enter}-{enter}', 'last');

      // switch to layer panel
      cy.switchPanel('layers');

      // results
      cy.getReact('Graph').getProps('data.nodes').should('have.length', 9);

      cy.getReact('Graph').getProps('data.edges').should('have.length', 14);
    });
  });
});
