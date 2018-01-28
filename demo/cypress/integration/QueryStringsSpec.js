/* global cy describe it */

const root = "http://localhost:1234/queryStrings";

describe("Demo 2 - query strings", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Query Strings");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
        cy.get("[data-test=search-text]").should("exist");
        cy.get("[data-test=search-button]").should("exist");
    });

    it("searches", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=search-text]")
            .focus()
            .type("foo");
        cy.get("[data-test=search-button]").click();
        cy.url().should("contain", "/search?q=foo");
        cy.get("[data-test=header").should("contain", "Search");
        cy.get("[data-test=search-results").should("contain", "foo");
        cy.get("[data-test=search-text").should("have.attr", "value", "foo");
    });
});
