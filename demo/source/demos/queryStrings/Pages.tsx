import React, { Component } from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { ThemeProvider } from "emotion-theming";
import { Menu } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import NotFound from "../../pages/NotFound";

import lightTheme from "../../layout/themes/light";
import darkTheme from "../../layout/themes/dark";

const themes: Record<string, typeof lightTheme> = {
    light: lightTheme,
    dark: darkTheme
};

// The properties are injected via the routing HOC
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = ({ page, searchTerm, missingPath }: any) => {
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

// `location` here is a whole jarl-react `Location` (Record<string, any>) object,
// injected via the custom mapLocationToProps below.
interface PagesProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    location: any;
}

class Pages extends Component<PagesProps> {
    render() {
        const { themeName = "light" } = this.props.location;
        const whichTheme = themes[themeName];
        return (
            <Layout>
                <Helmet titleTemplate="%s | Query Strings | JARL Demos" />
                <Menu>
                    <MenuItem
                        to={{ page: "home", themeName }}
                        data-test="home-link"
                    >
                        Home
                    </MenuItem>
                    <MenuItem
                        to={{ page: "search", themeName }}
                        data-test="search-link"
                    >
                        Search
                    </MenuItem>
                    <MenuItem
                        to={{
                            // Default page just so links don't error during initial
                            // render when there isn't a location yet
                            // Note: Really need to prevent these errors blowing things up,
                            // but also need to make genuine errors not just fail silently
                            page: "home",
                            ...this.props.location,
                            themeName: themeName === "dark" ? "light" : "dark"
                        }}
                        data-test="theme-link"
                    >
                        Toggle Theme
                    </MenuItem>
                </Menu>
                {/* Wrap page in a ThemeProvider. All routes have access to themeName, via route nesting. */}
                <ThemeProvider theme={whichTheme}>
                    {renderPage(this.props.location)}
                </ThemeProvider>
            </Layout>
        );
    }
}

// Custom mapping function to inject the entire location object instead of individual
// fields. `TProps` is explicitly pinned to "no external props" - see basicRouting/
// Pages.tsx for why this is needed alongside the `Pages as any` cast.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default routing<Record<string, never>>(location => ({ location }))(Pages as any);
