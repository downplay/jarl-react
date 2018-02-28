import React, { Component } from "react";
import Helmet from "react-helmet";
import createHistory from "history/createBrowserHistory";
import { NavigationProvider } from "jarl-react";
import { hot } from "react-hot-loader";

import routerCode from "!!raw-loader!./Root";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { MainLayout } from "./layout";

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

        let content;
        let code;
        if (page === "demo") {
            const { Root: DemoRoot, routes: demoRoutes } = demo;
            content = (
                <DemoRoot
                    routes={demoRoutes}
                    history={history}
                    basePath={`/${demoName}`}
                />
            );
        } else {
            code = routerCode;
            content =
                page === "index" ? (
                    <Index />
                ) : (
                    <NotFound missingPath={missingPath} query={query} />
                );
        }
        console.log(code, content);
        return <MainLayout code={code}>{content}</MainLayout>;
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
