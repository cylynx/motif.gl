import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import * as layoutOptions from '../../../src/constants/layout-options';

describe('Setting Popovers', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.BANK);
  });

  it('should render Setting Popovers', () => {
    cy.react('Button', { props: { 'data-testid': 'ToolbarButton:Settings' } })
      .eq(0)
      .click();

    cy.react('SettingsPopover').should('exist');
  });

  describe('Graph Layout Changes', () => {
    const changeLayout = (label: string) => {
      cy.react('Select', { props: { id: 'SettingsPopover:GraphLayout' } })
        .eq(0)
        .type(`${label}{enter}`);
    };

    const findLayout = (id: string) =>
      layoutOptions.LAYOUT_NAMES.find((layout) => layout.id === id);

    it('Concentric', () => {
      const { type, minNodeSpacing } = layoutOptions.CONCENTRIC_DEFAULT;
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact('Graphin')
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.minNodeSpacing).should('deep.equal', minNodeSpacing);
        });
    });

    it('Radial', () => {
      const { type, unitRadius, linkDistance } = layoutOptions.RADIAL_DEFAULT;
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact('Graphin')
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.unitRadius).should('deep.equal', unitRadius);
          cy.wrap($layout.linkDistance).should('deep.equal', linkDistance);
        });
    });

    it('Grid', () => {
      const { type, rows } = layoutOptions.GRID_DEFAULT;
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact('Graphin')
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.rows).should('deep.equal', rows);
        });
    });

    it('Sequential', () => {
      const { type, nodeSep, rankSep, rankDir } = layoutOptions.DAGRE_DEFAULT;
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact('Graphin')
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.nodeSep).should('deep.equal', nodeSep);
          cy.wrap($layout.rankSep).should('deep.equal', rankSep);
          cy.wrap($layout.rankDir).should('deep.equal', rankDir);
        });
    });

    it('Circular', () => {
      const {
        type,
        startRadius,
        endRadius,
        angleRatio,
        divisions,
      } = layoutOptions.CIRCLE_DEFAULT;
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact('Graphin')
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.startRadius).should('deep.equal', startRadius);
          cy.wrap($layout.endRadius).should('deep.equal', endRadius);
          cy.wrap($layout.angleRatio).should('deep.equal', angleRatio);
          cy.wrap($layout.divisions).should('deep.equal', divisions);
        });
    });

    it('Force-Directed', () => {
      const { type } = layoutOptions.GRAPHIN_FORCE_DEFAULT;
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact('Graphin')
        .getProps('layout.type')
        .should('deep.equal', id);
    });

    it('Fruchterman-Force', () => {
      const {
        type,
        gravity,
        clusterGravity,
      } = layoutOptions.FRUCHTERMAN_DEFAULT;

      it('should convert layout', () => {
        const { label, id } = findLayout(type);
        changeLayout(label);

        cy.getReact('Graphin')
          .getProps('layout')
          .then(($layout) => {
            cy.wrap($layout.type).should('deep.equal', id);
            cy.wrap($layout.gravity).should('deep.equal', gravity);
            cy.wrap($layout.clusterGravity).should(
              'deep.equal',
              clusterGravity,
            );
          });
      });
    });

    it('X Y Coordinates', () => {
      const { label, id } = findLayout('preset');
      changeLayout(label);

      cy.getReact('Graphin')
        .getProps('layout.type')
        .should('deep.equal', id);
    });
  });

  describe('Node Size', () => {});

  describe('Edge Width', () => {});

  describe('Group Edge', () => {});
});
