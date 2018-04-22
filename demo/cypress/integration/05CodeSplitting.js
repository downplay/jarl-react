/* global cy describe it */

const root = "/codeSplitting";

// Note: Neither of these tests properly confirm whether code splitting is actually
// happening. Think about checking network traffic to confirm the load.
describe("Code Splitting", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Code Splitting");
        cy.title().should("include", "Loading");
        cy.get("[data-test=header]").should("contain", "Loading");
        cy.get("[data-test=header]").should("contain", "Home");
        cy.title().should("include", "Home");
    });

    it("loads the big page", () => {
        cy.visit(`${root}`);
        cy.get("[data-test=header]").should("contain", "Home");
        cy.get("[data-test=big-page-link]").click();
        cy.get("[data-test=header]").should("contain", "REALLY BIG PAGE");
    });
});
