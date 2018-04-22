import React, { Component } from "react";
import { routing } from "jarl-react";

import Helmet from "react-helmet";
import { Menu } from "semantic-ui-react";

import { Layout, MenuItem } from "../../layout";

import LandingPage from "./pages/Landing";
import AdminPage from "./pages/Admin";
import ContentPage from "./pages/Content";

class Pages extends Component {
    handleToggleLogin = () => {
        // Toggle authenticated state on or off to determine whether the admin
        // redirect takes effect
        this.props.setAuthenticated(!this.props.authenticated);
    };

    renderPage() {
        // Properties injected from router state
        const { page, reason, slug, contentPage, authenticated } = this.props;
        switch (page) {
            case "landing":
            default:
                return (
                    <LandingPage
                        reason={reason}
                        authenticated={authenticated}
                        onToggleLogin={this.handleToggleLogin}
                    />
                );
            case "admin":
                return <AdminPage authenticated={authenticated} />;
            case "content":
                // TODO: This worked around a bug (regression test in 04Redirects.js)
                // navigating from Found Content to Missing Content when it interims
                // tries to render the Found Content page. Not sure if there's a more
                // solid approach. Maybe finding a way to keep inbound and outbound
                // state completely separate.
                return contentPage ? (
                    <ContentPage slug={slug} content={contentPage} />
                ) : null;
            // Note: there is no case for the "moved" page because it never exists
        }
    }

    render() {
        return (
            <Layout>
                <Helmet titleTemplate="%s | Redirects | JARL Demos" />
                <Menu>
                    <MenuItem to={{ page: "landing" }} data-test="landing-link">
                        Landing Page
                    </MenuItem>
                    {/* There is no valid state to generate a link to
                        `/moved` so link directly to the URL instead */}
                    <MenuItem to="/moved" data-test="moved-link">
                        Moved
                    </MenuItem>
                    <MenuItem to={{ page: "admin" }} data-test="admin-link">
                        Admin
                    </MenuItem>
                    <MenuItem
                        to={{ page: "content", slug: "about-us" }}
                        data-test="found-content-link"
                    >
                        Real Content
                    </MenuItem>
                    <MenuItem
                        to={{ page: "content", slug: "not-a-real-page" }}
                        data-test="missing-content-link"
                    >
                        Missing Content
                    </MenuItem>
                </Menu>
                {this.renderPage()}
            </Layout>
        );
    }
}

export default routing()(Pages);
