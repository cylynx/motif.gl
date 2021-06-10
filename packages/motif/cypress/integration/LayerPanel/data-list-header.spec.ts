import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';

describe('Data List Header', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.BANK);
  });

  describe('Visibility Button', () => {
    it('should hide the specific graph list', () => {
      cy.react('VisibilityButton').click();
      cy.wait(500);

      cy.react('Accordion', {
        props: {
          'data-testid': 'DataListAccordion',
        },
      }).click();

      cy.get('div[data-testid="nodes-count"]').last().should('have.text', '0/17');
      cy.get('div[data-testid="edges-count"]').last().should('have.text', '0/23');
    });
  });

  describe('Delete Layer', () => {
    it('should delete the specific graph list', () => {
      cy.react('DeleteButton$1').last().click();

      cy.getReact('LayerDetailed').should('not.exist');
    });
  });
});
