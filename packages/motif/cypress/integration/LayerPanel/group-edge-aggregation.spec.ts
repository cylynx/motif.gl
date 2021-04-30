import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';
import { Field } from '../../../src/redux/graph';
import { Option } from 'baseui/select';

describe('Group Edge Aggregations', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact();
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.BANK);
  });

  describe('Group Edges Toggle', () => {
    it('should determine whether graph data is groupable', () => {
      cy.getReact('GroupByFields')
        .getProps('disabled')
        .should('deep.eq', false);
    });

    it('should enable successfully', () => {
      cy.react('StatelessCheckbox').click();
      cy.wait(1000);

      cy.getReact('GroupByFields').getProps('toggle').should('deep.eq', true);
    });

    it('should toggle by all after enabled', () => {
      cy.getReact('GroupByFields').getProps('type').should('deep.eq', 'all');
    });

    it('should contains all the edge fields', () => {
      const expectedEdgeFields = [
        'amount',
        'balance',
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

      cy.get('li[role="option"]').contains(groupByType).click();

      cy.getReact('GroupByFields')
        .getProps('type')
        .should('deep.eq', groupByType);
    });
  });

  describe('Fields With Aggregations', () => {
    const fieldSelect = () => {
      return cy.getReact('Select', {
        props: {
          'data-testid': 'aggregate-fields:field',
        },
      });
    };

    const deleteButton = () => {
      return cy.getReact('Button', {
        props: {
          'data-testid': 'aggregate-fields:delete',
        },
      });
    };

    const aggregateSelect = () => {
      return cy.getReact('Select', {
        props: {
          'data-testid': 'aggregate-fields:aggregate',
        },
      });
    };

    it('should add a field after Add Attribute button is clicked', () => {
      cy.react('AddAttributesButton').click();

      fieldSelect().should('exist');
      deleteButton().should('exist');
      aggregateSelect().should('exist');
    });

    it('Add Attribute Button should not display if aggregation is not set', () => {
      cy.getReact('AddAttributesButton').should('not.exist');
    });

    it('should suggest numeric aggregations to selected field', () => {
      cy.react('Select', {
        props: {
          'data-testid': 'aggregate-fields:field',
        },
      })
        .last()
        .click();
      cy.get('li[role="option"]').contains('amount').click();

      aggregateSelect()
        .nthNode(0)
        .getProps('options')
        .then((options) => {
          const optionsField = options.map((option: Option) => option.id);
          expect(optionsField).to.deep.equal([
            'min',
            'max',
            'average',
            'count',
            'sum',
          ]);
        });
    });

    it('should suggest string aggregations to selected field', () => {
      cy.react('Select', {
        props: {
          'data-testid': 'aggregate-fields:field',
        },
      })
        .last()
        .click();
      cy.get('li[role="option"]').contains('date').click();

      aggregateSelect()
        .nthNode(0)
        .getProps('options')
        .then((options) => {
          const optionsField = options.map((option: Option) => option.id);
          expect(optionsField).to.deep.equal([
            'first',
            'last',
            'most_frequent',
          ]);
        });
    });

    it('should apply multiple aggregations onto the group edges', () => {
      cy.react('Select', {
        props: {
          'data-testid': 'aggregate-fields:aggregate',
        },
      })
        .last()
        .click();
      cy.get('li[role="option"]').contains('First').click();
      cy.react('Select', {
        props: {
          'data-testid': 'aggregate-fields:aggregate',
        },
      })
        .last()
        .click();
      cy.get('li[role="option"]').contains('Last').click();

      aggregateSelect()
        .nthNode(0)
        .getProps('value')
        .then((values) => {
          const valueId = values.map((value: Option) => value.id);
          expect(valueId).to.deep.equal(['first', 'last']);
        });
    });

    it('should remove the fields', () => {
      cy.react('Button', {
        props: {
          'data-testid': 'aggregate-fields:delete',
        },
      })
        .last()
        .click();

      fieldSelect().should('not.exist');
      deleteButton().should('not.exist');
      aggregateSelect().should('not.exist');
    });
  });
});
