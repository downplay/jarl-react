/* global Cypress cy describe it */

const root = "http://localhost:1234";

describe("Demo 1 - basic routing", () => {
    it("load home page", () => {
        cy.visit(`${root}/`);
        cy.title().should("include", "demo 1");
        cy.get("[data-test=header]").should("contain", "Home");
    });

    it("load about page", () => {
        cy.visit(`${root}/about`);
        cy.title().should("include", "demo 1");
        cy.get("[data-test=header]").should("contain", "About");
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

    it("prove that page didn't refresh", () => {
        cy.visit(`${root}/`);
        const about = cy.get("[data-test=about-link]");
        about.should("contain", "About");
        // Mutate the link text
        console.log(about.get()); //.innerHtml = "About Test";
        about.should("contain", "About Test");
        // Now navigate
        about.click();
        cy.get("[data-test=header]").should("contain", "About");
        // If the render updated properly, the mutated
        // link should still be mutated
        const about2 = cy.get("[data-test=about-link]");
        about2.should("contain", "About");
    });
});
