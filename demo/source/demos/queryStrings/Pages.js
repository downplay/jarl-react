import React, { Component } from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { ThemeProvider } from "emotion-theming";
import { Menu } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import NotFound from "../../pages/NotFound";

import * as lightTheme from "../../layout/themes/light";
import * as darkTheme from "../../layout/themes/dark";
import SearchForm from "./components/SearchForm";

const themes = {
    light: lightTheme,
    dark: darkTheme
};

// The properties are injected via the routing HOC
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
                    <Menu position="right">
                        <SearchForm />
                    </Menu>
                </Menu>
                {/* Wrap page in a ThemeProvider. All routes have access to themeName, via route nesting. */}
                <ThemeProvider theme={whichTheme}>
                    {renderPage(this.props.location)}
                </ThemeProvider>
            </Layout>
        );
    }
}

// Custom mapping function to inject the entire location object instead of individual fields
export default routing(location => ({ location }))(Pages);
