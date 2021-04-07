import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';
import * as layoutOptions from '../../../src/constants/layout-options';
import * as form from '../../../src/containers/SidePanel/OptionsPanel/constants';
import {
  EdgeStyleOptions,
  EdgeWidthFixed,
  EdgeWidthProperty,
  GraphData,
  GraphSelectors,
  NodeSizeDegree,
  NodeSizeFixed,
  NodeSizeProperty,
  NodeStyleOptions,
} from '../../../src/redux/graph';
import { NestedFormData } from '../../../src/components/form';

describe('Setting Popovers', () => {
  const findDefaultFromForm = (
    form: NestedFormData,
    layout: string,
    controllerName: string,
  ) => {
    return form[layout].find((value: any) => value.id === controllerName);
  };

  const getEdgeStyleFromReduxStore = (): Promise<EdgeStyleOptions> => {
    return new Promise((resolve) => {
      cy.getReact('Provider')
        .getProps('store')
        .then((store) => {
          const globalStore = store.getState();
          const { edgeStyle } = GraphSelectors.getGraph(
            globalStore,
          ).styleOptions;
          return resolve(edgeStyle);
        });
    });
  };

  const getNodeStyleFromReduxStore = (): Promise<NodeStyleOptions> => {
    return new Promise((resolve) => {
      cy.getReact('Provider')
        .getProps('store')
        .then((store) => {
          const globalStore = store.getState();
          const { nodeStyle } = GraphSelectors.getGraph(
            globalStore,
          ).styleOptions;
          return resolve(nodeStyle);
        });
    });
  };

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

  describe('Node Size', () => {
    it('Fixed', async () => {
      cy.react('Controller', { props: { name: 'size' } }).type('Fixed{enter}');

      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const nodeSizeType = 'fixed';
      const controllerName = 'value';

      cy.react('SettingsPopover')
        .react('NestedForm', {
          props: { id: 'nodeSize' },
        })
        .react('Controller', { props: { name: controllerName } })
        .nthNode(0)
        .type(arrows);

      const formDefaults = findDefaultFromForm(
        form.nodeSizeForm,
        nodeSizeType,
        controllerName,
      );
      const { max } = formDefaults;

      const nodeStyle = await getNodeStyleFromReduxStore();
      const { id, value } = nodeStyle.size as NodeSizeFixed;
      expect(id).to.deep.equal(nodeSizeType);
      expect(value).to.deep.equal(max / 2 + 2);
    });

    it('Degree of Connections', async () => {
      cy.react('Controller', { props: { name: 'size' } }).type('Degree{enter}');

      const nodeSizeType = 'degree';
      const controllerName = 'range';

      const formDefaults = findDefaultFromForm(
        form.nodeSizeForm,
        nodeSizeType,
        controllerName,
      );
      const { value } = formDefaults;

      const nodeStyle = await getNodeStyleFromReduxStore();
      const { id, range } = nodeStyle.size as NodeSizeDegree;
      expect(id).to.deep.equal(nodeSizeType);
      expect(range).to.deep.equal(value);
    });

    it('Property (User Defined)', async () => {
      const nodeSizeType = 'property';
      const controllerName = 'range';

      cy.react('Controller', { props: { name: 'size' } }).type(
        'Property{enter}',
      );
      cy.react('Controller', { props: { name: 'variable' } }).type(
        'risk_score{enter}',
      );

      const formDefaults = findDefaultFromForm(
        form.nodeSizeForm,
        nodeSizeType,
        controllerName,
      );
      const { value } = formDefaults;

      const nodeStyle = await getNodeStyleFromReduxStore();
      const { id, range, variable } = nodeStyle.size as NodeSizeProperty;
      expect(id).to.deep.equal(nodeSizeType);
      expect(variable).to.deep.equal('risk_score');
      expect(range).to.deep.equal(value);
    });
  });

  describe('Edge Width', () => {
    const changeWidthType = (type: string) => {
      cy.react('Controller', { props: { name: 'width' } }).type(
        `${type}{enter}`,
      );
    };

    const changeWidthVariable = (variable: string) => {
      cy.react('Controller', { props: { name: 'variable' } })
        .nthNode(1)
        .type(`${variable}{enter}`);
    };

    it('Fixed', async () => {
      changeWidthType('fixed');

      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const edgeSizeType = 'fixed';
      const controllerName = 'value';

      cy.react('SettingsPopover')
        .react('NestedForm')
        .react('Controller', { props: { name: controllerName } })
        .nthNode(1)
        .type(arrows);

      const { min, max } = findDefaultFromForm(
        form.edgeWidthForm,
        edgeSizeType,
        controllerName,
      );

      const edgeStyle = await getEdgeStyleFromReduxStore();
      const { id, value } = edgeStyle.width as EdgeWidthFixed;
      expect(id).to.deep.equal(edgeSizeType);
      expect(value).to.deep.equal((min + max) / 2 + 0.1);
    });

    it('Property (User Defined)', async () => {
      const edgeSizeType = 'property';
      const selectedVariable = 'is_foreign_source';
      const controllerName = 'range';

      changeWidthType('Property');
      changeWidthVariable(selectedVariable);

      const { value } = findDefaultFromForm(
        form.edgeWidthForm,
        edgeSizeType,
        controllerName,
      );

      const edgeStyle = await getEdgeStyleFromReduxStore();
      const { id, range, variable } = edgeStyle.width as EdgeWidthProperty;
      expect(id).to.deep.equal(edgeSizeType);
      expect(variable).to.deep.equal(selectedVariable);
      expect(range).to.deep.equal(value);
    });
  });
});
