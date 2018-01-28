import React, { Component } from "react";
import Helmet from "react-helmet";
import { compose } from "recompose";

import { withState } from "jarl-react";

import { Layout, Menu, MenuItem } from "../../layout";

import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import NotFound from "../../pages/NotFound";

// The properties are injected via the withState HOC
const renderPage = ({ page, searchTerm, missingPath }) => {
    switch (page) {
        case "home":
            return <HomePage />;
        case "search":
            return <SearchPage searchTerm={searchTerm} />;
        default:
            // Handle missing pages
            return <NotFound missingPath={missingPath} />;
    }
};

class Pages extends Component {
    render() {
        return (
            <Layout>
                <Helmet titleTemplate="%s | Query Strings | JARL Demos" />
                <Menu>
                    <MenuItem to={{ page: "home" }} data-test="home-link">
                        Home
                    </MenuItem>
                    <MenuItem to={{ page: "search" }} data-test="search-link">
                        Search
                    </MenuItem>
                </Menu>
                {renderPage(this.props)}
            </Layout>
        );
    }
}

export default compose(withState())(Pages);
