import {
  GraphData,
  GraphState,
  GraphSelectors,
  GraphSlices,
  StyleOptions,
} from '../../../src/redux/graph';

const jsonDatasetRootPath = 'LocalFiles/Json';

describe('Import Single Local File', () => {
  const getGraphStates = (): Promise<GraphState> => {
    return new Promise((resolve) => {
      cy.getReact('Provider')
        .getProps('store')
        .then((store) => {
          const globalStore = store.getState();
          const graphState = GraphSelectors.getGraph(globalStore);
          return resolve(graphState);
        });
    });
  };

  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  beforeEach(() => {
    cy.react('ImportDataButton').click();
  });

  afterEach(() => {
    cy.react('ClearDataButton').click();
  });

  const circleWithoutStyles = `${jsonDatasetRootPath}/circle-without-styles.json`;
  const circleWithStyles = `${jsonDatasetRootPath}/circle-with-styles.json`;
  const gridWithStyles = `${jsonDatasetRootPath}/grid-with-styles.json`;

  describe('Local Files Import', () => {
    it('should import one file successfully', () => {
      cy.get('input[type="file"]').attachFile(circleWithoutStyles);
      cy.get('button[type="submit"]').click();

      cy.getReact('Graphin')
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(18);
          expect(nodes.length).to.deep.equal(10);
        });
    });

    it('should import two files successfully', () => {
      cy.get('input[type="file"]').attachFile([
        circleWithoutStyles,
        circleWithoutStyles,
      ]);
      cy.get('button[type="submit"]').click();

      cy.getReact('Graphin')
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(18);
          expect(nodes.length).to.deep.equal(10);
        });
    });
  });

  describe('Single File Without Style', () => {
    it('should not overwrites the default graph styles', async () => {
      cy.get('input[type="file"]').attachFile(circleWithoutStyles);
      cy.get('button[type="submit"]').click();

      const graphState: GraphState = await getGraphStates();
      const styleOptions: StyleOptions = graphState.styleOptions;
      const { styleOptions: initialStyleState } = GraphSlices.initialState;

      expect(styleOptions).to.deep.equal(initialStyleState);
    });
  });

  describe('Single File With Style', () => {
    it('should overwrite if graph styles are not modified', async () => {
      cy.get('input[type="file"]').attachFile(circleWithStyles);
      cy.get('button[type="submit"]').click();

      const graphState: GraphState = await getGraphStates();
      const styleOptions: StyleOptions = graphState.styleOptions;

      const expectedOutput: StyleOptions = {
        layout: { type: 'graphin-force' },
        nodeStyle: {
          color: { value: 'orange', id: 'fixed' },
          size: { value: 47, id: 'fixed' },
          label: 'id',
        },
        edgeStyle: {
          width: { id: 'fixed', value: 1 },
          label: 'source',
          pattern: 'dot',
          fontSize: 16,
          arrow: 'none',
        },
        resetView: true,
        groupEdges: false,
      };

      expect(styleOptions).to.deep.equal(expectedOutput);
    });

    it('should overwrite modified graph styles with import styles', async () => {
      cy.get('input[type="file"]').attachFile(gridWithStyles);
      cy.get('button[type="submit"]').click();

      // should display confirmation modal if graph style is modified
      cy.getReact('ConfirmationModal').should('exist');
      cy.get('[data-testid="confirmation-modal:accept"]').click();

      const graphState: GraphState = await getGraphStates();
      const styleOptions: StyleOptions = graphState.styleOptions;

      const expectedOutput: StyleOptions = {
        layout: {
          type: 'grid',
          begin: [0, 0],
          preventOverlapPadding: 20,
          rows: 6,
          sortBy: 'degree',
          condense: false,
          preventOverlap: true,
          workerEnabled: true,
        },
        nodeStyle: {
          color: { value: 'blue', id: 'fixed' },
          size: { range: [5, 37], id: 'degree' },
          label: 'label',
          fontSize: 12,
        },
        edgeStyle: {
          width: { value: 2.3, id: 'fixed' },
          label: 'source',
          pattern: 'dot',
          fontSize: 16,
          arrow: 'none',
        },
        resetView: true,
        groupEdges: false,
      };

      expect(styleOptions).to.deep.equal(expectedOutput);
    });

    it('should not overwrite modified graph styles with import styles', async () => {
      // import with circle layout
      cy.get('input[type="file"]').attachFile(circleWithStyles);
      cy.get('button[type="submit"]').click();

      // perform reject on style overwrites
      cy.get('[data-testid="confirmation-modal:reject"]').click();

      const graphState: GraphState = await getGraphStates();
      const styleOptions: StyleOptions = graphState.styleOptions;

      // the graph styles shall remain as grid.
      const expectedOutput: StyleOptions = {
        layout: {
          type: 'grid',
          begin: [0, 0],
          preventOverlapPadding: 20,
          rows: 6,
          sortBy: 'degree',
          condense: false,
          preventOverlap: true,
          workerEnabled: true,
        },
        nodeStyle: {
          color: { value: 'blue', id: 'fixed' },
          size: { range: [5, 37], id: 'degree' },
          label: 'label',
          fontSize: 12,
        },
        edgeStyle: {
          width: { value: 2.3, id: 'fixed' },
          label: 'source',
          pattern: 'dot',
          fontSize: 16,
          arrow: 'none',
        },
        resetView: true,
        groupEdges: false,
      };

      expect(styleOptions).to.deep.equal(expectedOutput);
    });
  });
});
