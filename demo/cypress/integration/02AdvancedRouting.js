/* global cy describe it */

const root = "http://localhost:3210/advancedRouting";

describe("Advanced Routing", () => {
    it("loads home page", () => {
        cy.visit(`${root}`);
        cy.title().should("include", "Advanced Routing");
        cy.title().should("include", "Home");
        cy.get("[data-test=header]").should("contain", "Home");
        cy
            .get("[data-test-demo-link=advancedRouting]")
            .should("have.attr", "data-test-active", "true");
    });

    it("defaults to details tab on product page", () => {
        cy.visit(`${root}`);
        cy.get("[data-test=product-link]").click();
        cy
            .get("[data-test=details-tab]")
            .should("exist")
            .and("contain", "Details");
        cy.get("[data-test=ratings-tab]").should("not.exist");
        cy.get("[data-test=gallery-tab]").should("not.exist");
    });

    it("navigates to other tabs on product page", () => {
        cy.visit(`${root}/product`);

        cy.get("[data-test=ratings-tab-link]").click();
        cy.url().should("eq", `${root}/product/ratings`);
        cy
            .get("[data-test=ratings-tab]")
            .should("exist")
            .and("contain", "Ratings");
        cy.get("[data-test=image-full-size]").should("not.exist");

        cy.get("[data-test=gallery-tab-link]").click();
        cy.url().should("eq", `${root}/product/gallery/1`);
        cy
            .get("[data-test=gallery-tab]")
            .should("exist")
            .and("contain", "Gallery");
        cy
            .get("[data-test=image-full-size]")
            .should("exist")
            .and("have.attr", "src", `https://picsum.photos/200/300?image=0`);

        // Back to default tab
        cy.get("[data-test=details-tab-link]").click();
        cy.url().should("eq", `${root}/product`);
        cy
            .get("[data-test=details-tab]")
            .should("exist")
            .and("contain", "Details");
    });

    it("navigates to different pictures in the gallery", () => {
        cy.visit(`${root}/product/gallery/1`);
        for (let n = 2; n <= 10; n++) {
            cy.get(`[data-test=gallery-image-link-${n}]`).click();
            cy
                .get("[data-test=image-full-size]")
                .should("exist")
                .and(
                    "have.attr",
                    "src",
                    `https://picsum.photos/200/300?image=${n - 1}`
                );
        }
    });

    it("has missing image id for missing image", () => {
        cy.visit(`${root}/product/gallery/11`);
        cy
            .get("[data-test=missing-image]")
            .should("exist")
            .and("contain", "Image id 11 not found!");
    });
});
