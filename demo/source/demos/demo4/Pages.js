import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";

import { Layout, Menu, MenuItem } from "../../layout";

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
 * This time, our location state is injected directly from Redux connect
 */
const Pages = ({ page, missingPath }) => (
    <Layout>
        <Helmet titleTemplate="%s | Redux Integration | JARL Demos" />
        <Menu>
            <MenuItem to={{ page: "home" }}>Home</MenuItem>
            <MenuItem to={{ page: "product" }}>Product</MenuItem>
        </Menu>
        {renderPage(page, missingPath)}
    </Layout>
);

export default connect(({ navigation }) => ({ ...navigation }))(Pages);
