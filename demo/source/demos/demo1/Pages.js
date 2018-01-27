import React, { Component } from "react";
import { withState, Link } from "jarl-react";

import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import NotFound from "./pages/NotFound";

const renderPage = (page, missingPath) => {
    switch (page) {
        case "home":
            return <HomePage />;
        case "about":
            return <AboutPage />;
        default:
            // Handle missing pages
            return <NotFound missingPath={missingPath} />;
    }
};

class Pages extends Component {
    state = {
        // This marker is involved in E2E testing, to confirm that clicking a link
        // causes a partial page update, not a full reload. If the marker is set to true,
        // and then is still found to be true after a navigationm, we know that
        // the navigation was handled correct. See the e2e tests for demo 1 for
        // more information
        showMarker: false
    };

    handleMarkerClick = () => {
        this.setState({ showMarker: true });
    };

    render() {
        // JARL injects the `page` prop from state via withState HOC
        const { page, missingPath } = this.props;
        const { showMarker } = this.state;

        return (
            <article>
                <nav>
                    <ul>
                        <li>
                            <Link to={{ page: "home" }} data-test="home-link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to={{ page: "about" }} data-test="about-link">
                                About
                            </Link>
                        </li>
                    </ul>
                </nav>
                {renderPage(page, missingPath)}
                {showMarker ? (
                    <div data-test="marker">
                        This is showing because showMarker has been set to true
                        in state. Navigating via JARL&rsquo;s Link component
                        should not cause this state to reset, however clicking a
                        normal anchor will.
                        <a data-test="marker-anchor" href="/about">
                            Here is an anchor to test that!
                        </a>
                    </div>
                ) : (
                    <button
                        data-test="marker-button"
                        onClick={this.handleMarkerClick}
                    >
                        Marker
                    </button>
                )}
            </article>
        );
    }
}

export default withState()(Pages);
