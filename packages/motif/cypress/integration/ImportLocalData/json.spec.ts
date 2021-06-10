import {
  GraphData,
  GraphState,
  GraphSelectors,
  GraphSlices,
  StyleOptions,
} from '../../../src/redux/graph';

const jsonDatasetRootPath = 'LocalFiles/Json';

describe('Import Single Local File', () => {
  const graphinEl = 'Graphin2';
  const getGraphStates = (): Promise<GraphState> => {
    return new Promise((resolve) => {
      cy.getReact('Provider$1')
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

  const circleWithoutStyles = `${jsonDatasetRootPath}/circle-without-styles.json`;
  const circleWithStyles = `${jsonDatasetRootPath}/circle-with-styles.json`;
  const gridWithStyles = `${jsonDatasetRootPath}/grid-with-styles.json`;
  const simpleGraph = `${jsonDatasetRootPath}/simple-graph.json`;
  const restrictedTermsGraph = `${jsonDatasetRootPath}/restricted-word-dataset.json`;

  describe('Local Files Import', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.waitForReact();

      // close modal
      cy.get('button[aria-label="Close"]').click();
      cy.react('ImportDataButton').click();
    });

    afterEach(() => {
      cy.react('DeleteButton$1').nthNode(0).click();
    });

    it('should import one file successfully', () => {
      cy.get('input[type="file"]').attachFile(circleWithoutStyles);
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      cy.wait(500);

      cy.getReact(graphinEl)
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
      cy.get('button[type="submit"]').click();

      cy.wait(500);

      cy.getReact(graphinEl)
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(18);
          expect(nodes.length).to.deep.equal(10);
        });
    });

    it('should import one simple graph format successfully', () => {
      cy.get('input[type="file"]').attachFile(simpleGraph);

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      cy.wait(500);

      cy.getReact(graphinEl)
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(7);
          expect(nodes.length).to.deep.equal(15);
        });
    });

    it('should import combination of different formats', () => {
      cy.get('input[type="file"]').attachFile([
        simpleGraph,
        circleWithoutStyles,
      ]);

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      cy.wait(500);

      cy.getReact(graphinEl)
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(25);
          expect(nodes.length).to.deep.equal(15);
        });
    });
  });

  describe('Single File Without Style', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.waitForReact();
      cy.get('button[aria-label="Close"]').click();
      cy.react('ImportDataButton').click();
    });

    afterEach(() => {
      cy.react('DeleteButton$1').nthNode(0).click();
    });

    it('should not overwrites the default graph styles', async () => {
      cy.get('input[type="file"]').attachFile(circleWithoutStyles);

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      cy.wait(500);

      const graphState: GraphState = await getGraphStates();
      const styleOptions: StyleOptions = graphState.styleOptions;
      const { styleOptions: initialStyleState } = GraphSlices.initialState;

      expect(styleOptions).to.deep.equal(initialStyleState);
    });
  });

  describe('Single File With Style', () => {
    before(() => {
      cy.visit('/');
      cy.waitForReact();
      cy.get('button[aria-label="Close"]').click();
    });

    beforeEach(() => {
      cy.react('ImportDataButton').click();
    });

    afterEach(() => {
      cy.react('DeleteButton$1').nthNode(0).click();
    });

    it('should overwrite if graph styles are not modified', async () => {
      cy.get('input[type="file"]').attachFile(circleWithStyles);

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      cy.wait(500);

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
      };

      expect(styleOptions).to.deep.equal(expectedOutput);
    });

    it('should overwrite modified graph styles with import styles', async () => {
      cy.get('input[type="file"]').attachFile(gridWithStyles);

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      // should display confirmation modal if graph style is modified
      cy.getReact('ConfirmationModal').should('exist');
      cy.get('[data-testid="confirmation-modal:accept"]').click();

      cy.wait(500);

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
      };

      expect(styleOptions).to.deep.equal(expectedOutput);
    });

    it('should not overwrite modified graph styles with import styles', async () => {
      // import with circle layout
      cy.get('input[type="file"]').attachFile(circleWithStyles);

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      // perform reject on style overwrites
      cy.get('[data-testid="confirmation-modal:reject"]').click();

      // waiting for loading indicator to dissappear
      cy.wait(500);

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
      };

      expect(styleOptions).to.deep.equal(expectedOutput);
    });
  });

  describe('prevent upload restricted words dataset', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.waitForReact();
      cy.get('input[type="file"]').attachFile(restrictedTermsGraph);
      cy.get('button[type="submit"]').click();
    });

    it('should display error message', () => {
      cy.get('[data-testid="error-message"]').should('exist');
      cy.get('button[aria-label="Close"]').click();
    });
  });
});
