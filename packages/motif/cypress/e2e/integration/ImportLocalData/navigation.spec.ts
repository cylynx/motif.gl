import {
  initialState,
  FileUploadSelectors,
  TFileContentState,
} from '../../../../src/redux/import/fileUpload';

describe('Navigation', () => {
  const getFileUploadState = (): Promise<TFileContentState> => {
    return new Promise((resolve) => {
      cy.getReact('Provider$1')
        .getProps('store')
        .then((store) => {
          const globalStore = store.getState();
          const fileUploadState =
            FileUploadSelectors.getFileUpload(globalStore);
          return resolve(fileUploadState);
        });
    });
  };

  before(() => {
    cy.visit('/');
    cy.waitForReact();

    cy.get('button[aria-label="Close"]').click();
  });

  const jsonDatasetRootPath = 'LocalFiles/Json';
  const simpleGraph = `${jsonDatasetRootPath}/simple-graph.json`;

  describe('Multiple Import Attempts', () => {
    before(() => {
      cy.react('ImportDataButton').click();
      cy.get('input[type="file"]').attachFile(simpleGraph);
      cy.get('button[type="submit"]').click();
    });

    it('should display modal close confirmation modal', () => {
      cy.get('button[aria-label="Close"]').click();
      cy.getReact('ConfirmationModal')
        .nthNode(0)
        .getProps('isOpen')
        .should('deep.eq', true);
    });

    it('should reset the import state after close', async () => {
      cy.get('[data-testid="confirmation-modal:accept"]').click();
      const state: TFileContentState = await getFileUploadState();
      expect(state).to.deep.equal(initialState);
    });

    it('should allow imports after close modal without imports', () => {
      cy.react('ImportDataButton').click();
      cy.getReact('ImportWizardModal').should('exist');
    });
  });
});
