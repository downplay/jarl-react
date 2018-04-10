/* global cy describe it */

describe("Demos Shell", () => {
    it("loads home page", () => {
        cy.visit("/");
        cy.title().should("include", "JARL Demos");
        cy.get("[data-test=header]").should("contain", "Index");
    });

    it("shows not found page", () => {
        cy.visit("/asdfghjkl");
        cy.title().should("include", "Not Found");
        cy.get("[data-test=header]").should("contain", "Not Found");
        cy.get("[data-test=body]").should("contain", "/asdfghjkl");
    });
});
