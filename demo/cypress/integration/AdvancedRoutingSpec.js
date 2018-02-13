/* global cy describe it */

const root = "http://localhost:3210/advancedRouting";

describe("Demo 3 - advanced routing", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Advanced Routing");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
    });
});
