import { test, expect } from "@playwright/test";

const root = "/queryStrings";

// Ported from demo/cypress/integration/03QueryStrings.js
//
// Most of this suite needs the v2 route atoms to read/write query (search)
// params, which doesn't exist yet - see ticket 56 (expand atoms for e2e
// scenario gaps). Those scenarios are kept as faithful test.fixme() bodies
// so they're ready to flip on once that support lands.
test.describe("Query Strings", () => {
    test("loads home page", async ({ page }) => {
        await page.goto(root);
        await expect(page).toHaveTitle(/Query Strings/);
        await expect(page).toHaveTitle(/Home/);
        await expect(page.locator("[data-test=header]")).toContainText(
            "Home"
        );
        await expect(page.locator("[data-test=search-text]")).toBeVisible();
        await expect(
            page.locator("[data-test=search-button]")
        ).toBeVisible();
    });

    // Blocked on ticket 56: route atoms don't read/write query params yet.
    test.fixme("searches", async ({ page }) => {
        await page.goto(root);
        await page.locator("[data-test=search-text]").fill("foo");
        await page.locator("[data-test=search-button]").click();
        await expect(page).toHaveURL(/\/search\?q=foo/);
        await expect(page.locator("[data-test=header]")).toContainText(
            "Search"
        );
        await expect(
            page.locator("[data-test=search-results]")
        ).toContainText("foo");
        await expect(page.locator("[data-test=search-text]")).toHaveValue(
            "foo"
        );
    });

    test.describe("themes", () => {
        test("light theme", async ({ page }) => {
            await page.goto(root);
            await expect(page.locator("[data-test=page]")).toHaveCSS(
                "background-color",
                "rgb(255, 255, 255)"
            );
            await expect(page.locator("[data-test=header]")).toHaveCSS(
                "color",
                "rgb(0, 0, 0)"
            );
        });

        // Blocked on ticket 56: ?theme=dark query param support.
        test.fixme("dark theme", async ({ page }) => {
            await page.goto(`${root}?theme=dark`);
            await expect(page.locator("[data-test=page]")).toHaveCSS(
                "background-color",
                "rgb(0, 0, 0)"
            );
            await expect(page.locator("[data-test=header]")).toHaveCSS(
                "color",
                "rgb(255, 255, 255)"
            );
        });

        // Blocked on ticket 56: theme toggling needs query-string-aware
        // navigation.
        test.fixme("toggles theme", async ({ page }) => {
            await page.goto(root);
            await page.locator("[data-test=theme-link]").click();
            await expect(page.locator("[data-test=page]")).toHaveCSS(
                "background-color",
                "rgb(0, 0, 0)"
            );
            await expect(page.locator("[data-test=header]")).toHaveCSS(
                "color",
                "rgb(255, 255, 255)"
            );
        });

        // Blocked on ticket 56: toggling theme while preserving other query
        // params needs query-string support.
        test.fixme(
            "toggles theme and preserves location",
            async ({ page, baseURL }) => {
                await page.goto(`${root}/search?q=hello`);
                await page.locator("[data-test=theme-link]").click();
                await expect(page).toHaveURL(
                    `${baseURL}${root}/search?theme=dark&q=hello`
                );
                await expect(
                    page.locator("[data-test=search-results]")
                ).toContainText("hello");
                await expect(page.locator("[data-test=page]")).toHaveCSS(
                    "background-color",
                    "rgb(0, 0, 0)"
                );
            }
        );
    });
});
