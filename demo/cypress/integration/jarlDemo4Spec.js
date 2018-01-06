/* global Cypress cy describe it */

const root = "http://localhost:1234";

describe("Demo 4 - redux integration", () => {
    it("load home page", () => {
        cy.visit(`${root}/`);
        cy.title().should("include", "demo 1");
        cy.get("[data-test=header]").should("contain", "Home");
    });
});
