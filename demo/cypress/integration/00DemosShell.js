/* global cy Cypress describe it */

import packageJson from "../../package.json";

describe("Demos Shell", () => {
    it("loads home page", () => {
        cy.visit("/");
        cy.title().should("include", "About");
        cy.get("[data-test=content] h1").should("contain", "JARL");
        cy
            .get("[data-test=content] h1+p")
            .should("contain", "Just Another Router Library for React.");
        const jarlVersion = Cypress.env("JARL_VERSION");
        const buildNum = Cypress.env("CIRCLE_BUILD_NUM");
        cy.get("[data-test=version").should(
            "contain",
            // Checking the buildnum here didn't work because we get a different
            // buildNum on the 2nd job but the version was compiled in on the 1st job
            jarlVersion || `v${packageJson.version}${buildNum ? "-" : ""}`
        );
        // Note: This screenshot is for the CI bot to post with announcements
        // and should be left here with the same name
        cy.wait(1000); // Arbitrary wait for the font to load
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

        // TODO: Annoyingly this next part of the test didn't work, JARL_VERSION
        // seems to be empty even when doing a build. Would be nice to make this work.
        /*
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
        */
    });
});
