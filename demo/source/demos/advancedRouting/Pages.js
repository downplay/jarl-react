import React from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { Menu } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

import HomePage from "./pages/Home";
import ProductPage from "./pages/Product";
import NotFound from "../../pages/NotFound";

const renderPage = (page, missingPath) => {
    switch (page) {
        case "home":
            return <HomePage />;
        case "product":
            return <ProductPage />;
        default:
            return <NotFound missingPath={missingPath} />;
    }
};

/**
 * JARL injects the `page` prop from location via routing HOC
 */
const Pages = ({ page, missingPath }) => (
    <Layout>
        <Helmet titleTemplate="%s | Advanced Routing | JARL Demos" />
        <Menu>
            <MenuItem to={{ page: "home" }} data-test="home-link">
                Home
            </MenuItem>
            <MenuItem
                to={{ page: "product" }}
                data-test="product-link"
                element={Menu.Item}
            >
                Product
            </MenuItem>
        </Menu>
        {renderPage(page, missingPath)}
    </Layout>
);

export default routing()(Pages);
