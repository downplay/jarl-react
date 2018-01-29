/* global cy describe it */

const root = "http://localhost:1234/reduxIntegration";

describe("Demo 4 - Redux integration", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Redux Integration");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
    });
});
