import React, { Component } from "react";
import Helmet from "react-helmet";
import { ThemeProvider } from "emotion-theming";

import { withLocation } from "jarl-react";

import { Layout, Menu, MenuItem } from "../../layout";

import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import NotFound from "../../pages/NotFound";

import * as lightTheme from "../../layout/themes/light";
import * as darkTheme from "../../layout/themes/dark";

const themes = {
    light: lightTheme,
    dark: darkTheme
};

// The properties are injected via the withLocation HOC
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
        const { themeName = "light" } = this.props.location;
        const whichTheme = themes[themeName];
        const theme = { ...themeName };
        return (
            <Layout>
                <Helmet titleTemplate="%s | Query Strings | JARL Demos" />
                <Menu>
                    <MenuItem
                        to={{ page: "home", ...theme }}
                        data-test="home-link"
                    >
                        Home
                    </MenuItem>
                    <MenuItem
                        to={{ page: "search", ...theme }}
                        data-test="search-link"
                    >
                        Search
                    </MenuItem>
                    <MenuItem
                        to={{
                            ...this.props.location,
                            themeName: themeName === "dark" ? "light" : "dark"
                        }}
                        data-test="theme-link"
                    >
                        Toggle Theme
                    </MenuItem>
                </Menu>
                {/* Wrap page in a ThemeProvider. We have made themename available globally. */}
                <ThemeProvider theme={whichTheme}>
                    {renderPage(this.props.location)}
                </ThemeProvider>
            </Layout>
        );
    }
}

// Custom mapping function to inject location into
export default withLocation(location => ({ location }))(Pages);
