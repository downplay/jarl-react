/* global cy describe it */

const root = "http://localhost:3210/queryStrings";

describe("Demo 2 - query strings", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Query Strings");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
        cy.get("[data-test=search-text]").should("exist");
        cy.get("[data-test=search-button]").should("exist");
    });

    it("searches", () => {
        cy.visit(`${root}`);
        cy
            .get("[data-test=search-text]")
            .focus()
            .type("foo");
        cy.get("[data-test=search-button]").click();
        cy.url().should("contain", "/search?q=foo");
        cy.get("[data-test=header").should("contain", "Search");
        cy.get("[data-test=search-results").should("contain", "foo");
        cy.get("[data-test=search-text").should("have.attr", "value", "foo");
    });

    describe("themes", () => {
        it("light theme", () => {
            cy.visit(`${root}`);
            cy
                .get("[data-test=page")
                .should("have.css", "background-color", "rgb(255, 255, 255)");
            cy
                .get("[data-test=header")
                .should("have.css", "color", "rgb(0, 0, 0)");
        });

        it("dark theme", () => {
            cy.visit(`${root}?theme=dark`);
            cy
                .get("[data-test=page")
                .should("have.css", "background-color", "rgb(0, 0, 0)");
            cy
                .get("[data-test=header")
                .should("have.css", "color", "rgb(255, 255, 255)");
        });

        it("toggles theme", () => {
            cy.visit(`${root}`);
            cy.get("[data-test=theme-link] > a").click();
            cy
                .get("[data-test=page")
                .should("have.css", "background-color", "rgb(0, 0, 0)");
            cy
                .get("[data-test=header")
                .should("have.css", "color", "rgb(255, 255, 255)");
        });

        it("toggles theme and preserves location", () => {
            cy.visit(`${root}/search?q=hello`);
            cy.get("[data-test=theme-link] > a").click();
            cy.url().should("contain", "/search?theme=dark&q=hello");
            cy.get("[data-test=search-results").should("contain", "hello");
            cy
                .get("[data-test=page")
                .should("have.css", "background-color", "rgb(0, 0, 0)");
        });
    });
});
