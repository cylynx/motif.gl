describe('Option Panel', () => {
  before(() => {
    cy.visit('/');
    cy.waitForReact(5000);

    // close modal
    cy.get('button[aria-label="Close"]').click();

    // open option panels by clicking sidebar
    cy.switchPanel('options');
  });

  it('should render successfully', () => {
    cy.getReact('OptionsPanel').should('exist');
  });

  it('should render beside Left Navigation Bar', () => {
    cy.react('LeftLayer')
      .getReact('OptionsPanel')
      .should('exist');
  });

  it('should render Header component', () => {
    cy.getReact('OptionsPanel')
      .getReact('Header')
      .should('exist');
  });

  describe('Layout Options', () => {
    it('should render Layout Options', () => {
      cy.getReact('OptionsPanel')
        .getReact('OptionsLayout')
        .should('exist');
    });

    it('should possess one layout nested form', () => {
      cy.getReact('OptionsPanel')
        .getReact('OptionsLayout')
        .getReact('Accordion', {
          props: {
            'data-testid': 'OptionsLayout',
          },
        })
        .getProps('items.0')
        .then(($item) => {
          const { key, expanded, content } = $item;
          cy.wrap(key).should('deep.equal', 'layout');
          cy.wrap(expanded).should('deep.equal', true);
          cy.wrap(content.type.name).should('deep.equal', 'NestedForm');
          cy.wrap(content.type.length).should('deep.equal', 1);
        });
    });
  });

  describe('Node Style Options', () => {
    it('should render Node Style Options', () => {
      cy.getReact('OptionsPanel')
        .getReact('OptionsNodeStyles')
        .should('exist');
    });

    it('should possess four forms', () => {
      cy.getReact('OptionsPanel')
        .getReact('OptionsNodeStyles')
        .getReact('Accordion', {
          props: {
            'data-testid': 'OptionsNodeStyles',
          },
        })
        .getProps('items.0')
        .then(($item) => {
          const { key, expanded, content } = $item;
          cy.wrap(key).should('deep.equal', 'node styles');
          cy.wrap(expanded).should('deep.equal', true);
          cy.wrap(content.props.children).should('have.length', 4);
        });
    });
  });

  describe('Edge Style Options', () => {
    it('should render Edge Style Filter', () => {
      cy.getReact('OptionsPanel')
        .getReact('OptionsEdgeStyles')
        .should('exist');
    });

    it('should possess five forms', () => {
      cy.getReact('OptionsPanel')
        .getReact('OptionsEdgeStyles')
        .getReact('Accordion', {
          props: {
            'data-testid': 'OptionsEdgeStyles',
          },
        })
        .getProps('items.0')
        .then(($item) => {
          const { key, expanded, content } = $item;
          cy.wrap(key).should('deep.equal', 'edge styles');
          cy.wrap(expanded).should('deep.equal', true);
          cy.wrap(content.props.children).should('have.length', 5);
        });
    });
  });
});
