import {
  GraphData,
  GraphState,
  GraphSelectors,
  GraphSlices,
  StyleOptions,
  Field,
} from '../../../src/redux/graph';

const jsonDatasetRootPath = 'LocalFiles/Json';

describe('Import Single Local File', () => {
  const graphinEl = 'Graphin2';
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
  const simpleGraph = `${jsonDatasetRootPath}/simple-graph.json`;
  const customGroupEdgeGraph = `${jsonDatasetRootPath}/custom-grouped-edge-graph.json`;

  describe('Local Files Import', () => {
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

  describe('Single File with Group Edge Configurations', () => {
    const expectedGroupEdgeOutput = {
      toggle: true,
      availability: true,
      type: 'numeric',
      fields: {
        'Y_-ZK2S3P': {
          field: 'numeric',
          aggregation: ['min', 'max', 'average', 'count', 'sum'],
        },
        _8X9zGku9b: {
          field: 'value',
          aggregation: ['first', 'last', 'most_frequent'],
        },
        vVENjKDSxE: {
          field: 'date',
          aggregation: ['first', 'last', 'most_frequent'],
        },
      },
    };

    beforeEach(() => {
      cy.get('input[type="file"]').attachFile(customGroupEdgeGraph);

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      // waiting for loading indicator to dissappear
      cy.wait(500);
    });

    it('application should obtain the group edge configurations', () => {
      cy.getReact('LayerDetailed')
        .nthNode(0)
        .getProps('graph')
        .then((graph: GraphData) => {
          const { edges, nodes, metadata } = graph;

          expect(edges.length).to.deep.equal(9);
          expect(nodes.length).to.deep.equal(4);
          expect(metadata.groupEdges).to.deep.equal(expectedGroupEdgeOutput);
        });
    });

    it('statistic should display correct information', () => {
      cy.getReact('GraphStatistics')
        .nthNode(1)
        .getProps()
        .then((props) => {
          const {
            edgeLength,
            hiddenEdgeLength,
            hiddenNodeLength,
            nodeLength,
          } = props;

          expect(nodeLength).to.deep.equal(4);
          expect(edgeLength).to.deep.equal(6);
          expect(hiddenNodeLength).to.deep.equal(0);
          expect(hiddenEdgeLength).to.deep.equal(3);
        });
    });

    it('group by values should follows import data', () => {
      cy.getReact('GroupByFields')
        .nthNode(0)
        .getProps()
        .then((props) => {
          const { toggle, type, disabled } = props;

          expect(toggle).to.deep.equal(true);
          expect(type).to.deep.equal('numeric');
          expect(disabled).to.deep.equal(false);
        });
    });

    it('fields with aggregations should render according to import data', () => {
      cy.getReact('AggregateFields')
        .nthNode(0)
        .getProps('fields')
        .should('deep.eq', expectedGroupEdgeOutput['fields']);
    });

    it('edge properties should display correct edge aggregated fields', async () => {
      cy.react('EdgeProperties').click();

      const graphState: GraphState = await getGraphStates();
      const { edgeSelection } = graphState;

      cy.getReact('EdgeProperties')
        .nthNode(0)
        .getProps('edgeFields')
        .should('deep.eq', edgeSelection);
    });

    it('variable inspector should display correct selections', async () => {
      const { graphFlatten }: GraphState = await getGraphStates();
      const graphFields = graphFlatten.metadata.fields;
      const validTypes = ['integer', 'real', 'timestamp', 'date'];

      const nodeOptions = graphFields.edges
        .filter((f: Field) => validTypes.includes(f.type))
        .map((f) => {
          const optionKey = `edges-${f.name}`;
          return {
            id: f.name,
            label: f.name,
            type: f.type,
            analyzerType: f.analyzerType,
            format: f.format,
            from: 'edges',
            optionKey,
          };
        });

      cy.getReact('SelectVariable')
        .nthNode(0)
        .getProps('options.Edges')
        .should('deep.eq', nodeOptions);
    });
  });
});
