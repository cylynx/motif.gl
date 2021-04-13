import { NestedFormData } from '../../../packages/src/components/form';
import * as form from '../../../packages/src/containers/SidePanel/OptionsPanel/constants';
import { SampleData } from '../../../packages/src/containers/ImportWizardModal/SampleData';
import {
  GraphSelectors,
  EdgeStyleOptions,
  EdgeWidthFixed,
  EdgeWidthProperty,
  Edge,
} from '../../../packages/src/redux/graph';
import {
  EdgePattern,
  mapEdgePattern,
} from '../../../packages/src/utils/shape-utils';
import { DEFAULT_EDGE_STYLE } from '../../../packages/src/constants/graph-shapes';

describe('Edge Style Filter', () => {
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

  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.BANK);
    cy.switchPanel('options');
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

    it('should be fixed with specific line width', async () => {
      changeWidthType('fixed');

      const modifyValue = 1;
      const arrows = '{rightarrow}'.repeat(modifyValue);
      const edgeSizeType = 'fixed';
      const controllerName = 'value';

      cy.react('OptionsEdgeStyles')
        .react('NestedForm')
        .react('Controller', { props: { name: controllerName } })
        .nthNode(2)
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

    it('should adjust with property (user defined)', async () => {
      const edgeSizeType = 'property';
      const selectedVariable = 'amount';
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

  describe('Edge Label', () => {
    const changeLabelField = (value: string) => {
      cy.react('Controller', { props: { name: 'label' } })
        .last()
        .type(`${value}{enter}`);
    };

    it('should not display label when None', async () => {
      const selectedLabelField = '-';
      changeLabelField(selectedLabelField);

      const edgeStyle = await getEdgeStyleFromReduxStore();
      const edgeLabel: string = edgeStyle.label;
      expect(edgeLabel).to.deep.equal(selectedLabelField);
    });

    it('should not display label when selected', async () => {
      const selectedLabelField = 'is_foreign_target';
      changeLabelField(selectedLabelField);

      const edgeStyle = await getEdgeStyleFromReduxStore();
      const edgeLabel: string = edgeStyle.label;
      expect(edgeLabel).to.deep.equal(selectedLabelField);
    });
  });

  describe('Edge Pattern', () => {
    const changePatternField = (value: string) => {
      cy.react('Controller', { props: { name: 'pattern' } }).type(
        `${value}{enter}`,
      );
    };

    const assertEdgePattern = async (pattern: EdgePattern): Promise<void> => {
      const edgeStyle = await getEdgeStyleFromReduxStore();
      const edgePattern: string = edgeStyle.pattern;
      expect(edgePattern).to.deep.equal(pattern);

      cy.getReact('Graphin')
        .getProps('data.edges.0')
        .then((edge: Edge) => {
          const { lineDash } = edge.style.keyshape;
          expect(lineDash).to.deep.equal(mapEdgePattern(pattern));
        });
    };

    it('should display Line when None', () => {
      const selectedPatternField = 'none';
      changePatternField(selectedPatternField);

      // https://github.com/cylynx/motif.gl/pull/86
      // setting default linewidth if there are no dropdown variables
      cy.getReact('Graphin')
        .getProps('data.edges.0')
        .then((edge: Edge) => {
          const { lineWidth } = edge.style.keyshape;

          expect(lineWidth).to.deep.equal(3.8338044591773945);
        });
    });

    it('should display Dot', () => {
      const selectedPatternField = 'dot';
      changePatternField(selectedPatternField);
      assertEdgePattern(selectedPatternField);
    });

    it('should display Dash', () => {
      const selectedPatternField = 'dash';
      changePatternField(selectedPatternField);
      assertEdgePattern(selectedPatternField);
    });

    it('should display Dash Dot', () => {
      const selectedPatternField = 'dash-dot';
      changePatternField(selectedPatternField);
      assertEdgePattern(selectedPatternField);
    });
  });

  describe('Edge Font Size', () => {
    it('should change successfully', async () => {
      const modifyValue = 1;
      const arrow = '{rightarrow}'.repeat(modifyValue);
      const { max, value } = form.edgeFontSizeForm;

      cy.react('Controller', {
        props: { name: 'fontSize', defaultValue: [value] },
      })
        .last()
        .type(arrow);

      const edgeStyle = await getEdgeStyleFromReduxStore();
      const edgeLabelFontSize: number = edgeStyle.fontSize;
      expect(edgeLabelFontSize).to.be.within(25, 27);
    });
  });

  describe('Edge Arrow Options', () => {
    const controllerName = 'arrow';

    const changeArrow = (type: string) => {
      cy.react('Controller', {
        props: { name: controllerName },
      })
        .last()
        .type(`${type}{enter}`);
    };

    const assertReduxValue = async (type: string) => {
      const edgeStyle = await getEdgeStyleFromReduxStore();
      const edgeArrow: string = edgeStyle.arrow;
      expect(edgeArrow).to.deep.equal(type);
    };

    it('should hide arrow', async () => {
      const selectedValue = 'none';
      changeArrow(selectedValue);
      await assertReduxValue(selectedValue);

      cy.getReact('Graphin')
        .getProps('data.edges.0')
        .then((edge: Edge) => {
          const { endArrow } = edge.style.keyshape;
          expect(endArrow).to.deep.equal({
            d: -1 / 2,
            path: `M 0,0 L 0,0 L 0,0 Z`,
          });
        });
    });

    it('should display arrow', async () => {
      const selectedValue = 'display';
      changeArrow(selectedValue);
      await assertReduxValue(selectedValue);

      cy.getReact('Graphin')
        .getProps('data.edges.0')
        .then((edge: Edge) => {
          const { endArrow } = edge.style.keyshape;
          expect(endArrow).to.deep.equal(DEFAULT_EDGE_STYLE.keyshape.endArrow);
        });
    });
  });
});
