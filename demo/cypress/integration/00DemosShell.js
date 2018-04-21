/* global cy describe it */

import packageJson from "../../package.json";

describe("Demos Shell", () => {
    it("loads home page", () => {
        cy.visit("/");
        cy.title().should("include", "JARL Demos");
        cy.get("[data-test=header]").should("contain", "Index");
        // Note: This screenshot is for the CI bot to post with announcements
        // and should be left here with the same name
        cy.screenshot("HomePage");
    });

    it("shows not found page", () => {
        cy.visit("/asdfghjkl");
        cy.title().should("include", "Not Found");
        cy.get("[data-test=header]").should("contain", "Not Found");
        cy.get("[data-test=body]").should("contain", "/asdfghjkl");
    });

    it("shows the changelog", () => {
        cy.visit("/changelog");
        cy
            .get("[data-test=content] h1")
            .should("contain", "JARL: Version History");
        const h2 = cy.get("[data-test=content] h2");

        if (process.env.JARL_VERSION) {
            h2.eq(0).should("contain", process.env.JARL_VERSION);
        } else {
            h2.eq(0).should("contain", "Next version");
            h2.eq(1).should("contain", packageJson.version);
        }
    });
});
