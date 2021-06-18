import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Legend Popover', () => {
  const controllerName = 'color';

  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.BANK);
  });

  const changeColorType = (value: string) => {
    cy.react('Controller', { props: { name: controllerName } })
      .first()
      .type(`${value}{enter}`);
  };

  const changeColorVariable = (value: string) => {
    cy.react('Controller', { props: { name: 'variable' } }).type(
      `${value}{enter}`,
    );
  };

  describe('Functionality', () => {
    it('should display legend popover', () => {
      cy.react('Button', {
        props: { 'data-testid': 'ToolbarButton:Legend' },
      })
        .eq(0)
        .click();

      cy.getReact('LegendPopover').should('exist');
    });
  });

  describe('Node legend selection', () => {
    before(() => {
      cy.switchPanel('options');
      const selectedType: string = 'legend';
      changeColorType(selectedType);
      const selectedVariable = 'id';
      changeColorVariable(selectedVariable);
      cy.switchPanel('search');
    });

    it('should display node legend', async () => {
      cy.react('Button', {
        props: { 'data-testid': 'ToolbarButton:Legend' },
      })
        .eq(0)
        .click();
      cy.getReact('LegendPopover')
        .getReact('Legend', { props: { kind: 'node' } })
        .getProps('data')
        .should('deep.equal', {
          '-': '#e15759',
          account_balance: '#4e79a7',
          account_box: '#f28e2c',
        });
    });
  });

  describe('Edge legend selection', () => {
    before(() => {
      cy.waitForReact(2000);
      cy.switchPanel('options');
      cy.switchTab('edges');
      const selectedType: string = 'legend';
      changeColorType(selectedType);
      const selectedVariable = 'category';
      changeColorVariable(selectedVariable);
      cy.switchPanel('search');
    });

    it('should display edge legend', async () => {
      cy.react('Button', {
        props: { 'data-testid': 'ToolbarButton:Legend' },
      })
        .eq(0)
        .click();
      cy.getReact('LegendPopover')
        .getReact('Legend', { props: { kind: 'edge' } })
        .getProps('data')
        .should('deep.equal', { ib_txn: '#4e79a7', ownership: '#f28e2c' });
    });
  });
});
