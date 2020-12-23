/// <reference types="cypress" />
import 'cypress-react-selector';
import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';

describe('Navigation', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should open Modal when the page initialized', () => {
    cy.getReact('Modal')
      .getProps('isOpen')
      .should('eq', true);
  });

  it('should display sample data list after switched to [Sample Data] tabs', () => {
    switchSampleDataTabs('sample-data');

    cy.getReact('Tabs')
      .getProps('activeKey')
      .should('eq', 'sample-data');
  });

  it('should import Random Graph successfully', () => {
    cy.react('Cell', {
      props: { 'data-testid': SampleData.RANDOM_GRAPH },
    })
      .find('Button')
      .click();
  });

  const switchSampleDataTabs = (tabActiveKey: string) => {
    cy.react('Tabs')
      .react('InternalTab', {
        props: { childKey: tabActiveKey },
      })
      .click();
  };
});
