/* global cy Cypress describe it */

const root = "/redirects";
const baseUrl = Cypress.config("baseUrl");

describe("Redirects", () => {
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
            .get("[data-test=moved-link]")
            .should("have.attr", "href", "/redirects/moved")
            .click();
        cy.url().should("eq", `${baseUrl}${root}/?because=Permanently%20moved`);
        cy
            .get("[data-test=redirect-reason]")
            .should("contain", "Permanently moved");
    });

    it("redirects from admin page", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=admin-link]")
            .should("have.attr", "href", "/redirects/admin")
            .click();
        cy.url().should("eq", `${baseUrl}${root}/?because=Not%20authorised`);
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
        cy.get("[data-test=admin-link]").click();
        cy.url().should("eq", `${baseUrl}${root}/admin`);
        cy.get("[data-test=body]").should("contain", "super secret admin page");
    });

    it("goes to found content page", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=found-content-link]")
            .should("have.attr", "href", "/redirects/content/about-us")
            .click();
        cy.url().should("eq", `${baseUrl}${root}/content/about-us`);
        cy.get("[data-test=body]").should("contain", "a Norse or Danish chief");
    });

    it("redirects to missing content page from landing", () => {
        cy.visit(`${root}/content/not-a-real-page`);
        cy
            .url()
            .should(
                "eq",
                `${baseUrl}${root}/?because=Content%20was%20not%20found%3A%20%27not-a-real-page%27`
            );
        cy
            .get("[data-test=redirect-reason]")
            .should("contain", "Content was not found: 'not-a-real-page'");
    });

    it("redirects to missing content page from link", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=missing-content-link]")
            .should("have.attr", "href", "/redirects/content/not-a-real-page")
            .click();
        cy
            .url()
            .should(
                "eq",
                `${baseUrl}${root}/?because=Content%20was%20not%20found%3A%20%27not-a-real-page%27`
            );
        cy
            .get("[data-test=redirect-reason]")
            .should("contain", "Content was not found: 'not-a-real-page'");
    });

    it("doesn't crash when visiting missing content after real content (regression)", () => {
        cy.visit(`${root}`);
        cy.get("[data-test=found-content-link]").click();
        cy.get("[data-test=body]").should("contain", "a Norse or Danish chief");
        cy.get("[data-test=missing-content-link]").click();
        cy
            .get("[data-test=redirect-reason]")
            .should("contain", "Content was not found: 'not-a-real-page'");
    });
});
