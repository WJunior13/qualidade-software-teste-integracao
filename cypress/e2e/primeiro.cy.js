/// <reference types="cypress"/>
describe
    ('Teste1', () => {
        beforeEach(() => {
            cy.visit(('https://wcaquino.me/cypress/componentes.html'));
        })
       

        it('teste', () => {
      
            cy.get('#buttonSimple').click();
            cy.get('#buttonSimple').should('have.value', 'Obrigado!');
            cy.get('body').should('contain', 'Campo de Treinamento');
        })

        it('verify button', () => {
            cy.get('#buttonSimple').should('be.visible').should('have.value', 'Clique Me!');
        })

        it('input', () => {
            cy.get('#formNome').should('be.visible').type('teste1');
            cy.get('#formNome').should('have.value', 'teste1');
        })

        it.only('popularCampos', () => {
            cy.get('#formNome').should('be.visible').type('João');
            cy.get('[data-cy="dataSobrenome"]').type("Silva");
            cy.get('#formSexoMasc').check();
            cy.get('#formComidaCarne').check();
            cy.get('[data-test="dataEscolaridade"]').select('superior');
            cy.get('[data-testid="dataEsportes"]').select('Futebol');
            cy.get('#elementosForm\\:sugestoes').type("O sistema deveria ser mais intuitivo");
            cy.get('#formCadastrar').click();
            cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!');
        })
    
    })