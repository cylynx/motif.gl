import { GraphData } from '../../../src/redux/graph';

const edgeDatasetRootPath = 'LocalFiles/EdgeList';

describe('Import Edge List', () => {
  const selectEdgeListDataType = () => {
    cy.react('Controller', { props: { name: 'dataType' } }).click();
    cy.get('li[role="option"')
      .contains('Edge List Csv')
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
    selectEdgeListDataType();
  });

  afterEach(() => {
    cy.react('ClearDataButton').click();
  });

  const sampleEdge = `${edgeDatasetRootPath}/edge_dataset.csv`;

  describe('Local Files Import', () => {
    it('should import one file successfully', () => {
      cy.get('input[type="file"]').attachFile(sampleEdge);
      cy.get('button[type="submit"]').click();

      cy.getReact('Graphin')
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(4);
          expect(nodes.length).to.deep.equal(4);
        });
    });

    it('should import two files successfully', () => {
      cy.get('input[type="file"]').attachFile([sampleEdge, sampleEdge]);
      cy.get('button[type="submit"]').click();

      cy.getReact('Graphin')
        .getProps('data')
        .then((graph: GraphData) => {
          const { edges, nodes } = graph;
          expect(edges.length).to.deep.equal(4);
          expect(nodes.length).to.deep.equal(4);
        });
    });
  });
});
