/* global cy describe it */

const root = "/reduxIntegration";

describe.skip("Redux Integration", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Redux Integration");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
    });
});
