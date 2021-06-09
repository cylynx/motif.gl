import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Multiple Selection', () => {
  const graphinEl = 'Graphin2';

  const deleteButtonClick = () => {
    cy.react('Button2', {
      props: {
        'data-testid': 'filter-selection-header:delete',
      },
    })
      .first()
      .click();
  };

  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);

    // switch tabs to sample data
    cy.switchTab('sample-data');

    // import sample data by clicking bank
    cy.importSampleData(SampleData.BANK);
    cy.switchPanel('filters');
  });

  describe('Double Strings filter', () => {
    beforeEach(() => {
      // switch to filter panel
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      deleteButtonClick();
      deleteButtonClick();
    });

    it('Single - Single combination', () => {
      // perform first selection
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_box{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'first');
      cy.filterMultiString('customer_81{enter}', 'first');
      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 1);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });

    it('Multiple - Single combination', () => {
      // perform first selection
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_box{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'first');
      cy.filterMultiString('customer_81{enter}customer_55{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 2);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });

    it('Multiple - Multiple combination', () => {
      // perform first selection
      cy.selectFilterSelection('customer_type{enter}', 'first');
      cy.filterMultiString('retail{enter}-{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'first');
      cy.filterMultiString('customer_81{enter}customer_55{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 2);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Triple Strings filter', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      deleteButtonClick();
      deleteButtonClick();
      deleteButtonClick();
    });

    it('Double - Double - Double combination', () => {
      // perform first selection
      cy.selectFilterSelection('customer_type{enter}', 'first');
      cy.filterMultiString('retail{enter}-{enter}');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'first');
      cy.filterMultiString('customer_81{enter}customer_55{enter}', 'first');

      // perform third selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_box{enter}-{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 2);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Numeric and String filter', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      deleteButtonClick();
      deleteButtonClick();
    });

    it('Numeric - Single String combination', () => {
      // perform first selection
      cy.selectFilterSelection('risk_score{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'first');
      cy.filterMultiString('customer_901{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 1);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });

    it('Numeric - Double String combination', () => {
      // perform first selection
      cy.selectFilterSelection('risk_score{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'first');
      cy.filterMultiString('customer_901{enter}customer_902{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 2);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });
  });

  describe('Numeric and Numeric filter', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    it('Double Numeric combination', () => {
      // perform first selection
      cy.selectFilterSelection('amount{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('is_different_bank{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 9);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 14);

      deleteButtonClick();
      deleteButtonClick();
    });

    it('Triple Numeric combination', () => {
      // perform first selection
      cy.selectFilterSelection('amount{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('is_different_bank{enter}', 'first');

      // perform third selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('risk_score{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 0);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);

      deleteButtonClick();
      deleteButtonClick();
      deleteButtonClick();
    });
  });

  describe('Numeric and String filter', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      deleteButtonClick();
      deleteButtonClick();
    });

    it('Numeric - Single String combination', () => {
      // perform first selection
      cy.selectFilterSelection('risk_score{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('id{enter}', 'first');
      cy.filterMultiString('customer_901{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 1);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });
  });

  describe('String and DateTime filter', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      deleteButtonClick();
      deleteButtonClick();
    });

    it('Single String - DateTime combination', () => {
      // perform first selection
      cy.selectFilterSelection('create_date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_balance{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 9);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 14);
    });

    it('Multi String - DateTime combination', () => {
      // perform first selection
      cy.selectFilterSelection('create_date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_box{enter}-{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 0);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 0);
    });
  });

  describe('String and Time filter', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      deleteButtonClick();
      deleteButtonClick();
    });

    it('Single String - Time combination', () => {
      // perform first selection
      cy.selectFilterSelection('time{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_balance{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 9);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 14);
    });

    it('Multi String - Time combination', () => {
      // perform first selection
      cy.selectFilterSelection('create_date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_balance{enter}-{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 9);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 14);
    });
  });

  describe('String and Date filter', () => {
    beforeEach(() => {
      cy.react('AddFilterButton').click();
    });

    afterEach(() => {
      deleteButtonClick();
      deleteButtonClick();
    });

    it('Single String - Date combination', () => {
      // perform first selection
      cy.selectFilterSelection('date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_balance{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 9);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 14);
    });

    it('Multi String - Date combination', () => {
      // perform first selection
      cy.selectFilterSelection('date{enter}', 'first');

      // perform second selection
      cy.react('AddFilterButton').click();
      cy.selectFilterSelection('icon{enter}', 'first');
      cy.filterMultiString('account_balance{enter}-{enter}', 'first');

      // results
      cy.getReact(graphinEl).getProps('data.nodes').should('have.length', 9);

      cy.getReact(graphinEl).getProps('data.edges').should('have.length', 14);
    });
  });
});
