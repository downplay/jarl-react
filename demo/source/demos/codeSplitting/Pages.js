import React, { Component } from "react";
import Helmet from "react-helmet";

import { routing, Link } from "jarl-react";

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
            <article>
                <Helmet titleTemplate="%s | Code Splitting | JARL Demos" />
                <nav>
                    <ul>
                        <li>
                            <Link to={{ page: "home" }} data-test="home-link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={{ page: "bigPage" }}
                                data-test="big-page-link"
                            >
                                About
                            </Link>
                        </li>
                    </ul>
                </nav>
                {// The Page component is being injected from the routes
                // table once the bundle has loaded
                Page ? <Page /> : renderPage(page, missingPath)}
            </article>
        );
    }
}

export default routing()(Pages);
