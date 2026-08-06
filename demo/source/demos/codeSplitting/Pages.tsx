import React, { Component } from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { Menu } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

// The default content to display before the first component has laoded
import Loading from "./pages/Loading";

// `missingPath` is accepted (it's passed at the call site below) but never
// actually used here - preserved as-is from the original JS.
const renderPage = (page?: string, missingPath?: string) => {
    switch (page) {
        default:
            // Until navigation complets we won't have a `page`
            // state, so show a loading spinner...
            return <Loading />;
    }
};

// `Page` is the dynamically code-split component resolved by routes.ts's
// `resolve` handlers (see the `page()` mapper there) - untyped, hence `any`.
interface PagesProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Page?: any;
    page?: string;
    missingPath?: string;
}

class Pages extends Component<PagesProps> {
    render() {
        // Resolved objects are pass in along with location properties
        // by `routing`
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default routing()(Pages as any);
