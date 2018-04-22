import React, { Component } from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { Menu } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

// The default content to display before the first component has laoded
import Loading from "./pages/Loading";

const renderPage = page => {
    switch (page) {
        default:
            // Until navigation complets we won't have a `page`
            // state, so show a loading spinner...
            return <Loading />;
    }
};

class Pages extends Component {
    render() {
        const { Page, page, missingPath } = this.props;
        return (
            <Layout>
                <Helmet titleTemplate="%s | Code Splitting | JARL Demos" />
                <Menu>
                    <MenuItem to={{ page: "home" }} data-test="home-link">
                        Home
                    </MenuItem>
                    <MenuItem
                        to={{ page: "bigPage" }}
                        data-test="big-page-link"
                    >
                        Big Page
                    </MenuItem>
                </Menu>
                {/**
                 * The Page component was injected from the onChange
                 * Handler in Root.js
                 */
                Page ? <Page /> : renderPage(page, missingPath)}
            </Layout>
        );
    }
}

export default routing()(Pages);
