/* global cy describe it */

const root = "http://localhost:1234/queryStrings";

describe("Demo 2 - query strings", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Query Strings");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
        cy.get("[data-test=search-button]").should("exist");
    });
});
