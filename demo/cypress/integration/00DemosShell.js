/* global cy Cypress describe it */

import packageJson from "../../package.json";

describe("Demos Shell", () => {
    it("loads home page", () => {
        cy.visit("/");
        cy.title().should("include", "JARL Demos");
        cy.get("[data-test=header]").should("contain", "Index");
        const jarlVersion = Cypress.env("JARL_VERSION");
        const buildNum = Cypress.env("CIRCLE_BUILD_NUM");
        cy
            .get("[data-test=version")
            .should(
                "contain",
                jarlVersion ||
                    `v${packageJson.version}${buildNum ? `-${buildNum}` : ""}`
            );
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

        const jarlVersion = Cypress.env("JARL_VERSION");

        if (jarlVersion) {
            cy
                .get("[data-test=content] h2")
                .eq(0)
                .should("contain", process.env.jarlVersion);
        } else {
            cy
                .get("[data-test=content] h2")
                .eq(0)
                .should("contain", "Next version");
            cy
                .get("[data-test=content] h2")
                .eq(1)
                .should("contain", `v${packageJson.version}`);
        }
    });
});
