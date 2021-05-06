import { SampleData } from '../../../src/containers/ImportWizardModal/SampleData';
import { EdgeInformation, Node } from '../../../src/redux/graph';

describe('Search Tabs', () => {
  const tabComponent = 'TabComponent2';
  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);
    cy.switchTab('sample-data');
    cy.importSampleData(SampleData.BANK);
    cy.switchPanel('search');
  });

  describe('Search Node', () => {
    const selectedString: string = 'account_103';
    before(() => {
      cy.react(tabComponent, { props: { id: 'nodes' } }).click();
      cy.react('SearchNode').type(`${selectedString}{enter}`);
    });

    it('should possess only one node', () => {
      cy.getReact('NodeResults').getProps('nodes').should('have.length', 1);
    });

    it('should display results correctly', () => {
      cy.getReact('NodeResults')
        .getProps('nodes.0')
        .then((node: Node) => {
          const { id, label } = node;
          expect(id).deep.equal(selectedString);
        });
    });

    it('should not render edge information results', () => {
      cy.getReact('EdgeResults').getProps('edges').should('have.length', 0);
    });
  });

  describe('Search Edge', () => {
    const selectedString: string = 'ownership_307';
    before(() => {
      cy.react(tabComponent, { props: { id: 'edges' } }).click();
      cy.react('SearchEdge').type(`${selectedString}{enter}`);
    });

    it('should possess only one node', () => {
      cy.getReact('EdgeResults').getProps('edges').should('have.length', 1);
    });

    it('should display results correctly', () => {
      cy.getReact('EdgeResults')
        .getProps('edges.0')
        .then((edgeInfo: EdgeInformation) => {
          const { edge, sourceNode, targetNode } = edgeInfo;

          const { id: edgeId, source, target } = edge;
          expect(edgeId).to.deep.equal(selectedString);
          expect(source).to.deep.equal('customer_901');
          expect(target).to.deep.equal('account_901');

          const { id: sourceId } = sourceNode;
          const { id: targetId } = targetNode;
          expect(sourceId).to.deep.equal(source);
          expect(targetId).to.deep.equal(target);
        });
    });

    it('should not render NodeResults', () => {
      cy.getReact('NodeResults').getProps('nodes').should('have.length', 0);
    });
  });
});
