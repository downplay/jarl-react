import React, { Component } from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { Menu, Button } from "semantic-ui-react";
import { Layout, MenuItem } from "../../layout";

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
        // JARL injects the `page` prop from state along with the `stringify` callback
        // via the `routing` HOC
        const { page, missingPath, stringify } = this.props;
        const { showMarker } = this.state;

        return (
            <Layout>
                <Helmet titleTemplate="%s | Basic Routing | JARL Demos" />
                <Menu>
                    <MenuItem to={{ page: "home" }} data-test="home-link">
                        Home
                    </MenuItem>
                    <MenuItem to={{ page: "about" }} data-test="about-link">
                        About
                    </MenuItem>
                </Menu>
                {renderPage(page, missingPath)}
                {showMarker ? (
                    <div data-test="marker">
                        This is showing because showMarker has been set to true
                        in state. Navigating via JARL&rsquo;s Link component
                        should not cause this state to reset, however clicking a
                        normal anchor will.
                        <br />
                        {/* Line break needed. Otherwise anchor got split onto two
                        lines causing Cypress to fail to click on it! */}
                        <a data-test="marker-anchor" href={stringify("/about")}>
                            Here is an anchor to test that!
                        </a>
                    </div>
                ) : (
                    <Button
                        data-test="marker-button"
                        onClick={this.handleMarkerClick}
                    >
                        Marker
                    </Button>
                )}
            </Layout>
        );
    }
}

// Inject all fields from location state as props, along with the stringify function
export default routing(null, ({ stringify }) => ({
    stringify
}))(Pages);
