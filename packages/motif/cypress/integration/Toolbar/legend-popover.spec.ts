import { SampleData } from '../../../packages/src/containers/ImportWizardModal/SampleData';
import {
  GraphSelectors,
  NodeColorFixed,
  NodeColorLegend,
  NodeStyleOptions,
} from '../../../packages/src/redux/graph';

describe('Legend Popover', () => {
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

  describe('Functionality', () => {
    const changeNodeColor = (type: string): void => {
      cy.react('Select', { props: { id: 'legendSelection' } })
        .eq(0)
        .type(`${type}{enter}`);
    };

    it('should display legend popover', () => {
      cy.react('Button', {
        props: { 'data-testid': 'ToolbarButton:Legend' },
      })
        .eq(0)
        .click();

      cy.getReact('LegendPopover').should('exist');
    });

    it('should change the colours of nodes', async () => {
      const selectedProperty = 'id';
      changeNodeColor('id');

      const nodeStyle = await getNodeStyleFromReduxStore();
      const { id, variable, mapping } = nodeStyle.color as NodeColorLegend;
      expect(id).to.deep.equal('legend');
      expect(variable).to.deep.equal(selectedProperty);
      assert.isObject(mapping);
    });

    it('should change to fixed color', async () => {
      cy.react('Button', {
        props: { 'data-testid': 'switchFixedColor' },
      })
        .eq(0)
        .click();

      const nodeStyle = await getNodeStyleFromReduxStore();
      const { id, value } = nodeStyle.color as NodeColorFixed;
      expect(id).to.deep.equal('fixed');
      expect(value).to.deep.equal('#66c2a5');
    });
  });
});
