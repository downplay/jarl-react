/* global cy describe it */

const root = "http://localhost:3210/basicRouting";

describe("Demo 1 - basic routing", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Basic Routing");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
    });

    it("loads about page", () => {
        cy.visit(`${root}/about`);
        cy.title().should("include", "About");
        cy.get("[data-test=header]").should("contain", "About");
    });

    it("trigger 404 page", () => {
        cy.visit(`${root}/foo/bar`);
        cy.title().should("include", "404");
        cy.get("[data-test=header]").should("contain", "404");
        cy.get("[data-test=mordor]").should("contain", "foo/bar");
    });

    it("navigate to about page", () => {
        cy.visit(`${root}/`);
        cy.get("[data-test=about-link]").click();
        cy.get("[data-test=header]").should("contain", "About");
    });

    it("navigate back again", () => {
        cy.visit(`${root}/`);
        cy.get("[data-test=about-link]").click();
        cy.get("[data-test=home-link]").click();
        cy.get("[data-test=header]").should("contain", "Home");
    });

    it("navigate with browser back button", () => {
        cy.visit(`${root}/`);
        cy.get("[data-test=about-link]").click();
        cy.go("back");
        cy.get("[data-test=header]").should("contain", "Home");
    });

    it("navigate with browser forward button", () => {
        cy.visit(`${root}/`);
        cy.get("[data-test=about-link]").click();
        cy.go("back");
        cy.go("forward");
        cy.get("[data-test=header]").should("contain", "About");
    });

    it("sets some transient state", () => {
        cy.visit(`${root}/`);
        cy.get("[data-test=marker-button]").click();
        cy.get("[data-test=marker]").should("exist");
    });

    it("clicking anchor reloads page", () => {
        cy.visit(`${root}/`);
        cy.get("[data-test=marker-button]").click();
        cy.get("[data-test=marker-anchor]").click();
        cy.get("[data-test=marker]").should("not.exist");
    });

    it("clicking Link doesn't reload page", () => {
        cy.visit(`${root}/`);
        cy.get("[data-test=marker-button]").click();
        cy.get("[data-test=about-link]").click();
        // Marker should still exist as state should have been retained
        cy.get("[data-test=marker]").should("exist");
    });
});
