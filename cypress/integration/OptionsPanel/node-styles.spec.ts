import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import * as form from '../../../src/containers/SidePanel/OptionsPanel/constants';
import { NestedFormData } from '../../../src/components/form/NestedForm';
import {
  GraphSelectors,
  NodeSizeDegree,
  NodeSizeFixed,
  NodeSizeProperty,
  NodeStyleOptions,
} from '../../../src/redux/Graph';

describe('Node Style Filter', () => {
  const findDefaultFromLayoutForm = (
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

      const formDefaults = findDefaultFromLayoutForm(
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

      const formDefaults = findDefaultFromLayoutForm(
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

      const formDefaults = findDefaultFromLayoutForm(
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
});
