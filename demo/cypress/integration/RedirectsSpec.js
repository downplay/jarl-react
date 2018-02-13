/* global cy describe it */

const root = "http://localhost:3210/redirects";

describe("JARL Demos - Redirects", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Redirects");
        cy.title().should("include", "Landing");
        cy.get("[data-test=header]").should("contain", "Landing");
    });
});
