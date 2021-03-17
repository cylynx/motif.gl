import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import { Field } from '../../../src/redux/graph';

const jsonDatasetRootPath = 'LocalFiles/Json';

describe('Group Edge Aggregations', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    // cy.get('button[aria-label="Close"]').click();

    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.BANK);
  });

  // beforeEach(() => {
  //   cy.react('ImportDataButton').click();
  //   cy.switchTab('sample-data');
  //   cy.importSampleData(SampleData.BANK);
  // });
  //
  // afterEach(() => {
  //   cy.react('ClearDataButton').click();
  // });

  describe('Group Edges Toggle', () => {
    it('should determine whether graph data is groupable', () => {
      cy.getReact('GroupByFields')
        .getProps('disabled')
        .should('deep.eq', false);
    });

    it('should enable successfully', () => {
      cy.react('StatelessCheckbox').click();
      cy.wait(1000);

      cy.getReact('GroupByFields')
        .getProps('toggle')
        .should('deep.eq', true);
    });

    it('should toggle by all after enabled', () => {
      cy.getReact('GroupByFields')
        .getProps('type')
        .should('deep.eq', 'all');
    });

    it('should contains all the edge fields', () => {
      const expectedEdgeFields = [
        'amount',
        'category',
        'date',
        'is_foreign_source',
        'is_foreign_target',
        'is_high_risk_source_target_location',
        'relation',
        'source_owner',
        'target_owner',
        'time',
      ];

      cy.getReact('GroupByFields')
        .getProps('edgeFields')
        .then((fields) => {
          const edgeFields = fields.map((field: Field) => field.id);
          expect(edgeFields).to.deep.equal(expectedEdgeFields);
        });
    });

    it('should group by custom value', () => {
      const groupByType = 'is_foreign_source';
      cy.react('Select', {
        props: { 'data-testid': 'group-by-fields:select' },
      })
        .last()
        .click();

      cy.get('li[role="option"]')
        .contains(groupByType)
        .click();

      cy.getReact('GroupByFields')
        .getProps('type')
        .should('deep.eq', groupByType);
    });
  });

  describe('Fields With Aggregations', () => {
    it('should add a field after Add Attribute button is clicked', () => {
      cy.react('AddAttributesButton').click();

      cy.getReact('Select', {
        props: {
          'data-testid': 'aggregate-fields:field',
        },
      }).should('exist');

      cy.getReact('Button', {
        props: {
          'data-testid': 'aggregate-fields:delete',
        },
      }).should('exist');

      cy.getReact('Select', {
        props: {
          'data-testid': 'aggregate-fields:aggregate',
        },
      }).should('exist');
    });

    it('Add Attribute Button should not display if aggregation is not set', () => {
      cy.getReact('AddAttributesButton').should('not.exist');
    });
  });
});
