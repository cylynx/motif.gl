import {
  GraphData,
  GraphState,
  GraphSelectors,
  Field,
} from '../../../src/redux/graph';

const jsonDatasetRootPath = 'LocalFiles/Json';

describe('Import Single Local File', () => {
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

  const customGroupEdgeGraph = `${jsonDatasetRootPath}/custom-grouped-edge-graph.json`;

  before(() => {
    cy.visit('/');
    cy.waitForReact();
    cy.get('input[type="file"]').attachFile(customGroupEdgeGraph);
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').click();
  });

  const expectedGroupEdgeOutput = {
    toggle: true,
    availability: true,
    type: 'numeric',
    ids: ['group-a-b2', 'group-a-b4', 'group-c-d2'],
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

  it('application should obtain the group edge configurations', () => {
    cy.react('Accordion', {
      props: {
        'data-testid': 'DataListAccordion',
      },
    }).click();

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
    cy.get('div[data-testid="nodes-count"]').last().should('have.text', '4/4');
    cy.get('div[data-testid="edges-count"]').last().should('have.text', '6/9');
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
