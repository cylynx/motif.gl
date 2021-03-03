import { GraphData } from '../../../src/redux/graph';

const nodeEdgeRootPath = 'LocalFiles/NodeEdge';
const edgeDatasetRootPath = 'LocalFiles/EdgeList';

describe('Import Edge List', () => {
  const selectNodeEdgeFormat = () => {
    cy.react('Controller', { props: { name: 'dataType' } }).click();
    cy.get('li[role="option"')
      .contains('Node Edge Csv (2 Files)')
      .click();
  };

  before(() => {
    cy.visit('/');
    cy.waitForReact();

    // close modal
    cy.get('button[aria-label="Close"]').click();
  });

  beforeEach(() => {
    cy.react('ImportDataButton').click();
    selectNodeEdgeFormat();
  });

  const nodeDataset = `${nodeEdgeRootPath}/node_dataset.csv`;
  const edgeDataset = `${nodeEdgeRootPath}/edge_dataset.csv`;
  const sampleEdge = `${edgeDatasetRootPath}/edge_dataset.csv`;

  describe('Local Files Import', () => {
    it('should import both node and edge successfully', () => {
      cy.get('input[type="file"]').attachFile([nodeDataset, edgeDataset]);
      cy.get('button[type="submit"]').click();

      cy.getReact('Graphin')
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(3);
          expect(nodes.length).to.deep.equal(3);
        });

      cy.react('ClearDataButton').click();
    });

    describe('Wrong format provided', function() {
      beforeEach(() => {
        cy.get('input[type="file"]').attachFile(sampleEdge);
      });

      it('should display warning message when wrong format is provided', () => {
        cy.get('div[data-baseweb="file-uploader"').contains(
          'Please ensure the correct number of files are uploaded and correctly labelled',
        );
      });
    });
  });
});
