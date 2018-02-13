import React, { Component } from "react";
import Helmet from "react-helmet";
import createHistory from "history/createBrowserHistory";
import { NavigationProvider } from "jarl-react";
import { hot } from "react-hot-loader";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { Layout } from "./layout";

import * as demos from "./demos";

const routes = [
    {
        path: "/",
        state: { page: "index" }
    },
    {
        path: "/:demoName?*=:all",
        state: { page: "demo" },
        match: ({ demoName, ...rest }) => {
            if (!demos[demoName]) {
                return false;
            }
            return { ...rest, demoName, demo: demos[demoName] };
        },
        routes: [
            {
                path: "/*:rest",
                state: { subPage: true }
            }
        ]
    },
    {
        path: "/*:missingPath?*=:query",
        state: { page: "notFound" }
    }
];

const history = createHistory();

/**
 * Custom top-level routing; routes to each separate demo and allows
 * them to act as self-contained sites.
 *
 * This is a valid case for needing to nest multiple RouteProviders
 * with different configurations. The basePath
 */
class Root extends Component {
    state = { routing: {} };

    handleNavigateEnd = state => {
        this.setState({
            routing: state
        });
    };

    renderDemo() {
        const { page, demo, demoName, missingPath, query } = this.state.routing;

        if (page === "demo") {
            const { Root: DemoRoot, routes: demoRoutes } = demo;
            return (
                <DemoRoot
                    routes={demoRoutes}
                    history={history}
                    basePath={`/${demoName}`}
                />
            );
        }
        return (
            <Layout>
                {page === "index" ? (
                    <Index />
                ) : (
                    <NotFound missingPath={missingPath} query={query} />
                )}
            </Layout>
        );
    }

    render() {
        return (
            <NavigationProvider
                history={history}
                routes={routes}
                onNavigateEnd={this.handleNavigateEnd}
                state={this.state.routing}
            >
                <Helmet titleTemplate="JARL Demos | %s" />
                {this.renderDemo()}
            </NavigationProvider>
        );
    }
}

export default hot(module)(Root);
