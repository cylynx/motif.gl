describe('Navigation', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
  });

  it('should open Modal when the page initialized', () => {
    cy.getReact('ImportWizardModal').should('exist');
  });

  it('should display sample data list after switched to [Sample Data] tabs', () => {
    switchSampleDataTabs('sample-data');

    cy.getReact('Tabs$1').getProps('activeKey').should('eq', 'sample-data');
  });

  it('should display six categories of sample data', () => {
    cy.react('Cell').should('have.length', 6);
  });

  const switchSampleDataTabs = (tabActiveKey: string) => {
    cy.react('Tabs$1')
      .react('InternalTab', {
        props: { childKey: tabActiveKey },
      })
      .click();
  };
});
