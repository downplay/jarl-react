/* global cy describe it */

const root = "http://localhost:3210/redirects";

describe("JARL Demos - Redirects", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Redirects");
        cy.title().should("include", "Landing");
        cy.get("[data-test=header]").should("contain", "Landing");
        cy.get("[data-test=redirect-reason]").should("contain", "no redirect");
    });

    it("redirects from moved page", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=moved-link] a")
            .should("have.attr", "href", "/redirects/moved")
            .click();
        cy.url().should("eq", `${root}/?because=Permanently%20moved`);
        cy
            .get("[data-test=redirect-reason]")
            .should("contain", "Permanently moved");
    });

    it("redirects from admin page", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=admin-link] a")
            .should("have.attr", "href", "/redirects/admin")
            .click();
        cy.url().should("eq", `${root}/?because=Not%20authorised`);
        cy
            .get("[data-test=redirect-reason]")
            .should("contain", "Not authorised");
    });

    it("goes to admin page when authorised", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=login-button]")
            .should("contain", "Login")
            .click()
            .should("contain", "Logout");
        cy.get("[data-test=admin-link] a").click();
        cy.url().should("eq", `${root}/admin`);
        cy.get("[data-test=body]").should("contain", "super secret admin page");
    });
});
