import React, { Component } from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { Menu, Button } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import NotFound from "./pages/NotFound";

const renderPage = (page: string, missingPath: string) => {
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

// Props are injected by the `routing` HOC below: `page`/`missingPath` come from
// location state (mirrors jarl-react's own `Location = Record<string, any>`
// design), `stringify` is mapped explicitly via mapRoutingToProps.
interface PagesProps {
    page: string;
    missingPath: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stringify: (location: any) => string;
}

interface PagesState {
    showMarker: boolean;
}

class Pages extends Component<PagesProps, PagesState> {
    state: PagesState = {
        // This marker is involved in E2E testing, to confirm that clicking a link
        // causes a partial page update, not a full reload. If the marker is set to true,
        // and then is still found to be true after a navigationm, we know that
        // the navigation was handled correct. See the e2e tests for demo 1 for
        // more information
        showMarker: false
    };

    handleMarkerClick = (): void => {
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

// Inject all fields from location state as props, along with the stringify function.
// `Pages` is cast to `any` here, and the HOC's `TProps` explicitly pinned to "no
// external props", because `routing`'s generic HOC typing (based on React's legacy
// context API) can't statically express "these props are injected by the HOC rather
// than passed in by callers" - a documented dynamic boundary. Without the explicit
// `TProps`, it would otherwise be inferred from the `mapRoutingToProps` callback's
// return value, which would wrongly require callers (e.g. Root.tsx's `<Pages />`)
// to pass `stringify` themselves.
export default routing<Record<string, never>>(null, ({ stringify }) => ({
    stringify
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}))(Pages as any);
