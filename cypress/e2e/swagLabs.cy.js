/// <reference types="cypress"/>


describe('Teste de Login', () => {

    beforeEach(() => {
        cy.visit('https://www.saucedemo.com');
    });

    it('Deve realizar o login com sucesso', () => {
        fazerLogin();
        cy.url().should('include', '/inventory');
        cy.contains('Products');
    });

    it('Deve exibir uma mensagem de erro para login inválido', () => {

        cy.get('#user-name').should('be.visible').type('locked_out_user');
        cy.get('#password').should('be.visible').type('secret_sauce');
        cy.get('#login-button').click()
        cy.get('[data-test="error"]').should('be.visible')
            .contains('this user has been locked out')
    });
});
describe('Teste para adicionar itens ao carrinho', () => {

    beforeEach(() => {
        fazerLogin();
    });

    it('Deve adicionar 3 itens ao carrinho de compras', () => {
        adicionarTresItensCarrinho();
    });

    it('Deve adicionar e remover 1 item do carrinho de compras', () => {
        cy.get('#item_4_title_link > .inventory_item_name').should('have.text', 'Sauce Labs Backpack');
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('have.text', 'Add to cart');
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        cy.get('.shopping_cart_badge').should('have.text', '1');
        cy.get('[data-test="remove-sauce-labs-backpack"]').should('have.text', 'Remove');
        cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    });

});
describe('Teste para adicionar itens  e conferir o carrinho', () => {

    before(() => {
        fazerLogin();
        adicionarTresItensCarrinho();
    });

    it('Deve ir para carrinho de compras e conferir itens', () => {
        irParaCarrinho();
        conferirCarrinhoCompras();
    });

});

describe('Teste Inserir Informações Pessoais', () => {

    beforeEach(() => {
        fazerLogin();
        adicionarTresItensCarrinho();
        irParaCarrinho();
        conferirCarrinhoCompras();
        irParaCheckoutOne();
    });

    it('Deve validar informacoes pessoais vazia', () => {
        cy.get('[data-test="continue"]').click();
        cy.get('[data-test="firstName"]').should("be.empty");
        cy.get('[data-test="lastName"]').should("be.empty");
        cy.get('[data-test="postalCode"]').should("be.empty");
        cy.get('.error-message-container').should("be.visible");
    });

    it('Deve inserir informacoes pessoais', () => {
        inserirInfoPessoais();
    });

});

describe('Teste Conferencia CheckOut', () => {
    before(() => {
        fazerLogin();
        adicionarTresItensCarrinho();
        irParaCarrinho();
        conferirCarrinhoCompras();
        irParaCheckoutOne();
        inserirInfoPessoais();
    });

    it('Deve validar overview checkout', () => {
        irParaStepTwo();
        validarValoresCompra();
    });


});

describe('Teste Finalizar Compra', () => {
    before(() => {
        fazerLogin();
        adicionarTresItensCarrinho();
        irParaCarrinho();
        conferirCarrinhoCompras();
        irParaCheckoutOne();
        inserirInfoPessoais();
        irParaStepTwo();
        validarValoresCompra();
    });

    it('Deve finalizar a compra', () => {
       finalizarCompra();
       cy.get('.title').should('have.text',"Checkout: Complete!");
       cy.get('.pony_express').should("be.visible");
       cy.get('.complete-header').should('have.text','Thank you for your order!');
       cy.get('[data-test="back-to-products"]').should("be.visible").click();
    });
});

describe('Teste Logout', () => {
    before(() => {
        fazerLogin();
    });

    it('Deve realizar logout do sistema', () => {
       cy.get('#react-burger-menu-btn').click();
       cy.get('#logout_sidebar_link').click();
       cy.get('#user-name').should('be.visible');
       cy.get('#password').should('be.visible');
         
    });
});




//<------------------Funcoes reutilizadas----------------------------------->

function fazerLogin() {
    cy.visit('https://www.saucedemo.com');
    cy.get('#user-name').should('be.visible').type('standard_user');
    cy.get('#password').should('be.visible').type('secret_sauce');
    cy.get('#login-button').click();
}

function adicionarTresItensCarrinho() {
    cy.get('#item_4_title_link > .inventory_item_name').should('have.text', 'Sauce Labs Backpack');
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('#item_1_title_link > .inventory_item_name').should('have.text', 'Sauce Labs Bolt T-Shirt');
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    cy.get('#item_5_title_link > .inventory_item_name').should('have.text', 'Sauce Labs Fleece Jacket');
    cy.get('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    cy.get('.shopping_cart_badge').should('have.text', '3');
}

function irParaCarrinho() {
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart');
}
function irParaCheckoutOne() {
    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', '/checkout-step-one');
}

function irParaStepTwo(){
    cy.get('[data-test="continue"]').click();
    cy.url().should('include', '/checkout-step-two');
}
function finalizarCompra(){
    cy.get('[data-test="finish"]').click();
    cy.url().should('include', '/checkout-complete');
}

function conferirCarrinhoCompras() {
   cy.get('.title').should('have.text', 'Your Cart');
    cy.get('#item_4_title_link > .inventory_item_name').should('have.text', 'Sauce Labs Backpack');
    cy.get('#item_1_title_link > .inventory_item_name').should('have.text', 'Sauce Labs Bolt T-Shirt');
    cy.get('#item_5_title_link > .inventory_item_name').should('have.text', 'Sauce Labs Fleece Jacket');
    cy.get(':nth-child(3) > .cart_item_label > .item_pricebar > .inventory_item_price').should('have.text', "$29.99");
    cy.get(':nth-child(4) > .cart_item_label > .item_pricebar > .inventory_item_price').should('have.text', "$15.99");
    cy.get(':nth-child(5) > .cart_item_label > .item_pricebar > .inventory_item_price').should('have.text', "$49.99");
    cy.get('[data-test="checkout"]').should('be.visible');
}

function inserirInfoPessoais(){
    cy.get('[data-test="firstName"]').type("Joao")
    cy.get('[data-test="lastName"]').type("Silva");
    cy.get('[data-test="postalCode"]').type("88870-000");
}

function validarValoresCompra(){
    cy.get(".title").should('have.text',"Checkout: Overview");
    cy.get(".summary_subtotal_label").contains("$95.97");
    cy.get(".summary_total_label").contains("$103.65");
}