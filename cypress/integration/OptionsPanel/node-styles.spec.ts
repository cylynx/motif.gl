import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';
import * as form from '../../../src/containers/SidePanel/OptionsPanel/constants';
import { NestedFormData } from '../../../src/components/form/NestedForm';
import {
  GraphSelectors,
  NodeColorFixed,
  NodeColorLegend,
  NodeSizeDegree,
  NodeSizeFixed,
  NodeSizeProperty,
  NodeStyleOptions,
} from '../../../src/redux/graph';

describe('Node Style Filter', () => {
  const findDefaultFromForm = (
    form: NestedFormData,
    layout: string,
    controllerName: string,
  ) => {
    return form[layout].find((value: any) => value.id === controllerName);
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
    cy.switchPanel('options');
  });

  describe('Node Size', () => {
    it('should be fixed with specific size', async () => {
      cy.react('Controller', { props: { name: 'size' } }).type('Fixed{enter}');

      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const nodeSizeType = 'fixed';
      const controllerName = 'value';

      cy.react('OptionsNodeStyles')
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
      expect(value).to.deep.equal(max / 2 + modifyValue);
    });

    it('should adjust with degree of connections', async () => {
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

    it('should adjust with property (user defined)', async () => {
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

  describe('Node Label', () => {
    const controllerName = 'label';

    const changeNodeLabel = (value: string) => {
      cy.react('Controller', { props: { name: controllerName } })
        .first()
        .type(`${value}{enter}`);
    };

    it('should change successfully', async () => {
      const selectedLabel: string = 'id';
      changeNodeLabel(selectedLabel);

      const nodeStyle: NodeStyleOptions = await getNodeStyleFromReduxStore();
      const nodeLabel: string = nodeStyle.label;
      expect(nodeLabel).to.deep.equal(selectedLabel);
    });
  });

  describe('Node Colours', () => {
    const controllerName = 'color';

    before(() => {
      cy.visit('/');
      cy.waitForReact(5000);
      cy.switchTab('sample-data');
      cy.importSampleData(SampleData.BANK);
      cy.switchPanel('options');
    });

    const changeColorType = (value: string) => {
      cy.react('Controller', { props: { name: controllerName } })
        .first()
        .type(`${value}{enter}`);
    };

    const changeColorValue = (value: string) => {
      cy.react('Controller', { props: { name: 'value' } })
        .nthNode(1)
        .type(`${value}{enter}`);
    };

    const changeColorVariable = (value: string) => {
      cy.react('Controller', { props: { name: 'variable' } }).type(
        `${value}{enter}`,
      );
    };

    describe('should change with fixed node color', () => {
      const selectedType: string = 'fixed';

      const assertNodeColour = async (selectedColor: string) => {
        changeColorValue(selectedColor);

        const nodeStyle: NodeStyleOptions = await getNodeStyleFromReduxStore();
        const { id, value } = nodeStyle.color as NodeColorFixed;
        expect(id).to.deep.equal(selectedType);
        expect(value).to.deep.equal(selectedColor);
      };

      it('should change to teal', async () => {
        changeColorType(selectedType);
        await assertNodeColour('teal');
      });

      it('should change to blue', async () => {
        changeColorType(selectedType);
        await assertNodeColour('blue');
      });

      it('should change to green', async () => {
        changeColorType(selectedType);
        await assertNodeColour('green');
      });

      it('should change to orange', async () => {
        changeColorType(selectedType);
        await assertNodeColour('orange');
      });
    });

    describe('should change with legends', () => {
      const selectedType: string = 'legend';

      it('should display grey when variable is empty', async () => {
        changeColorType(selectedType);
        const nodeStyle: NodeStyleOptions = await getNodeStyleFromReduxStore();
        const { id, variable, mapping } = nodeStyle.color as NodeColorLegend;

        const { value } = findDefaultFromForm(
          form.nodeColorForm,
          selectedType,
          'variable',
        );
        expect(id).to.deep.equal(selectedType);
        expect(variable).to.deep.equal(value);
        assert.isObject(mapping);
      });

      it('should display colours based on mapping', async () => {
        changeColorType(selectedType);

        const selectedVariable = 'id';
        changeColorVariable(selectedVariable);

        const nodeStyle: NodeStyleOptions = await getNodeStyleFromReduxStore();
        const { id, variable, mapping } = nodeStyle.color as NodeColorLegend;
        expect(id).to.deep.equal(selectedType);
        expect(variable).to.deep.equal(selectedVariable);
        assert.isObject(mapping);
      });
    });
  });

  describe('Node Label Font Size', () => {
    const controllerName = 'fontSize';

    it('should change successfully', async () => {
      const modifyValue = 1;
      const { max, value } = form.nodeFontSizeForm;
      const arrow = '{rightarrow}'.repeat(modifyValue);
      cy.react('Controller', {
        props: { name: controllerName, defaultValue: [value] },
      })
        .nthNode(0)
        .type(arrow);

      const nodeStyle: NodeStyleOptions = await getNodeStyleFromReduxStore();
      const nodeLabelFontSize: number = nodeStyle.fontSize;
      expect(nodeLabelFontSize).to.deep.equal(max / 2 + 1);
    });
  });
});
