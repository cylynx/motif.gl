import * as layoutOptions from '../../../src/constants/layout-options';
import * as form from '../../../src/containers/SidePanel/OptionsPanel/constants';
import { NestedFormData } from '../../../src/components/form/NestedForm';
import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';
const findLayout = (id: string) =>
  layoutOptions.LAYOUT_NAMES.find((layout) => layout.id === id);

describe('Layout Options', () => {
  const layoutEl: string = 'layout';
  const graphinEl = 'Graphin2';

  const changeLayout = (label: string) => {
    cy.react('Controller', { props: { name: layoutEl } }).type(
      `${label}{enter}`,
    );
  };

  const findDefaultFromLayoutForm = (
    form: NestedFormData,
    layout: string,
    controllerName: string,
  ) => {
    return form[layout].find((value: any) => value.id === controllerName);
  };

  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.CIRCLE_GRAPH);
    cy.switchPanel('options');
  });

  describe('Concentric', () => {
    const { type, minNodeSpacing } = layoutOptions.CONCENTRIC_DEFAULT;

    it('should convert layout', () => {
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact(graphinEl)
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.minNodeSpacing).should('deep.equal', minNodeSpacing);
        });
    });

    it('should change node spacing', () => {
      const arrows = '{rightarrow}'.repeat(1);
      const controllerName: string = 'minNodeSpacing';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('be.within', 49, 52);
    });
  });

  describe('Radial', () => {
    const { type, unitRadius, linkDistance } = layoutOptions.RADIAL_DEFAULT;
    it('should convert layout', () => {
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact(graphinEl)
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.unitRadius).should('deep.equal', unitRadius);
          cy.wrap($layout.linkDistance).should('deep.equal', linkDistance);
        });
    });

    it('should change radius', () => {
      const arrows = '{rightarrow}'.repeat(1);
      const controllerName: string = 'unitRadius';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('be.within', 248, 251);
    });

    it('should change node spacing', () => {
      const arrows = '{rightarrow}'.repeat(1);
      const controllerName: string = 'linkDistance';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('be.within', 248, 251);
    });
  });

  describe('Grid', () => {
    const { type, rows } = layoutOptions.GRID_DEFAULT;
    it('should convert layout', () => {
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact(graphinEl)
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.rows).should('deep.equal', rows);
        });
    });

    it('should change number of rows', () => {
      const arrows = '{rightarrow}'.repeat(1);
      const controllerName: string = 'rows';
      const formDefaults = findDefaultFromLayoutForm(
        form.layoutForm,
        type,
        controllerName,
      );
      const { min, max } = formDefaults;

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('deep.equal', max / 2 + min);
    });
  });

  describe('Sequential', () => {
    const { type, nodeSep, rankSep, rankDir } = layoutOptions.DAGRE_DEFAULT;
    it('should convert layout', () => {
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact(graphinEl)
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.nodeSep).should('deep.equal', nodeSep);
          cy.wrap($layout.rankSep).should('deep.equal', rankSep);
          cy.wrap($layout.rankDir).should('deep.equal', rankDir);
        });
    });

    it('should change vertical spacing', () => {
      const arrows = '{rightarrow}'.repeat(1);
      const controllerName: string = 'rankSep';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('be.within', 248, 251);
    });

    it('should change horizontal spacing', () => {
      const arrows = '{rightarrow}'.repeat(1);
      const controllerName: string = 'nodeSep';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('be.within', 248, 251);
    });

    describe('Direction', () => {
      const controllerName: string = 'rankdir';

      const changeSequentialDirection = (
        direction: string,
        directionId: string,
      ) => {
        cy.react('Controller', { props: { name: controllerName } }).type(
          `${direction}{enter}`,
        );

        cy.getReact(graphinEl)
          .getProps(`layout.${controllerName}`)
          .should('deep.equal', directionId);
      };

      it('Top to Bottom', () => {
        changeSequentialDirection('Top to Bottom', 'TB');
      });

      it('Bottom to Top', () => {
        changeSequentialDirection('Bottom To Top', 'BT');
      });

      it('Left to Right', () => {
        changeSequentialDirection('Left to Right', 'LR');
      });

      it('Right to Left', () => {
        changeSequentialDirection('Right to Left', 'RL');
      });
    });
  });

  describe('Circular', () => {
    const {
      type,
      startRadius,
      endRadius,
      angleRatio,
      divisions,
    } = layoutOptions.CIRCLE_DEFAULT;

    it('should convert layout', () => {
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact(graphinEl)
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.startRadius).should('deep.equal', startRadius);
          cy.wrap($layout.endRadius).should('deep.equal', endRadius);
          cy.wrap($layout.angleRatio).should('deep.equal', angleRatio);
          cy.wrap($layout.divisions).should('deep.equal', divisions);
        });
    });

    it('should change start radius', () => {
      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const controllerName: string = 'startRadius';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('be.within', 248, 251);
    });

    it('should change end radius', () => {
      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const controllerName: string = 'endRadius';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('be.within', 248, 251);
    });

    it('should change angle ratio', () => {
      const modifyValue = 1;
      const arrows = '{leftarrow}'.repeat(modifyValue);
      const controllerName: string = 'angleRatio';

      const formDefaults = findDefaultFromLayoutForm(
        form.layoutForm,
        type,
        controllerName,
      );
      const { max } = formDefaults;

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('deep.equal', max / 2 - 0.1);
    });

    it('should change divisions', () => {
      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const controllerName: string = 'divisions';

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('deep.equal', divisions + modifyValue);
    });
  });

  describe('Force-Directed', () => {
    const { type } = layoutOptions.GRAPHIN_FORCE_DEFAULT;

    it('should convert to layout', () => {
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact(graphinEl).getProps('layout.type').should('deep.equal', id);
    });
  });

  describe('Fruchterman-Force', () => {
    const { type, gravity, clusterGravity } = layoutOptions.FRUCHTERMAN_DEFAULT;

    it('should convert layout', () => {
      const { label, id } = findLayout(type);
      changeLayout(label);

      cy.getReact(graphinEl)
        .getProps('layout')
        .then(($layout) => {
          cy.wrap($layout.type).should('deep.equal', id);
          cy.wrap($layout.gravity).should('deep.equal', gravity);
          cy.wrap($layout.clusterGravity).should('deep.equal', clusterGravity);
        });
    });

    it('should change gravity', () => {
      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const controllerName: string = 'gravity';

      const formDefaults = findDefaultFromLayoutForm(
        form.layoutForm,
        type,
        controllerName,
      );
      const { max } = formDefaults;

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('deep.equal', max / 2 + modifyValue);
    });

    it('should change cluster gravity', () => {
      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const controllerName: string = 'clusterGravity';

      const formDefaults = findDefaultFromLayoutForm(
        form.layoutForm,
        type,
        controllerName,
      );
      const { max } = formDefaults;

      cy.react('Controller', { props: { name: controllerName } }).type(arrows);

      cy.getReact(graphinEl)
        .getProps(`layout.${controllerName}`)
        .should('deep.equal', max / 2 + modifyValue);
    });
  });

  describe('X Y Coordinates', () => {
    it('should convert to layout', () => {
      const { label, id } = findLayout('preset');
      changeLayout(label);

      cy.getReact(graphinEl).getProps('layout.type').should('deep.equal', id);
    });
  });
});
