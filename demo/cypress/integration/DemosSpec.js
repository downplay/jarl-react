/* global cy describe it */

const root = "http://localhost:1234";

describe("Demos Shell", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "JARL Demos");
        cy.get("[data-test=header]").should("contain", "Index");
    });

    it("shows not found page", () => {
        cy.visit(`${root}/asdfghjkl`);
        cy.title().should("include", "Not Found");
        cy.get("[data-test=header]").should("contain", "Not Found");
        cy.get("[data-test=body]").should("contain", "/asdfghjkl");
    });
});
