import { SampleData } from '../../../src/containers/ImportWizard/ImportSampleData/ImportSampleData';
import * as form from '../../../src/containers/SidePanel/OptionsPanel/constants';
import { NestedFormData } from '../../../src/components/form/NestedForm';
import {
  GraphSelectors,
  NodeSizeFixed,
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
    cy.importSampleData(SampleData.CIRCLE_GRAPH);
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
      expect(id).to.deep.equal('fixed');
      expect(value).to.deep.equal(max / 2 + modifyValue);
    });
  });
});
