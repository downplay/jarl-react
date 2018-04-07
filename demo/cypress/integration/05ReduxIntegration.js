/* global cy describe it */

const root = "http://localhost:3210/reduxIntegration";

describe.skip("Demo 4 - Redux integration", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Redux Integration");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
    });
});
