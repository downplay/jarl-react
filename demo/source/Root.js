import React, { Component, Fragment } from "react";
import Helmet from "react-helmet";
import createHistory from "history/createBrowserHistory";
import { NavigationProvider } from "jarl-react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import * as demos from "./demos";

const routes = [
    {
        path: "/",
        state: { page: "index" }
    },
    {
        path: "/:demoName",
        state: { page: "demo" },
        // TODO: Implement resolvers
        resolve: ({ demoName }) => {
            if (!demos[demoName]) {
                return false;
            }
            return { demo: demos[demoName] };
        }
    },
    // TODO: Implement optional parameters to remove duplication
    {
        path: "/:demoName/*:rest",
        state: { page: "demo" },
        // TODO: Implement resolvers
        resolve: ({ demoName }) => {
            if (!demos[demoName]) {
                return false;
            }
            return { demo: demos[demoName] };
        }
    },
    {
        path: "/*:missingPath",
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
        const { page, demoName, missingPath } = this.state.routing;
        switch (page) {
            case "index":
                return <Index />;
            case "demo": {
                const { Root: DemoRoot, routes: demoRoutes } = demos[demoName];
                return (
                    <Fragment>
                        <DemoRoot
                            routes={demoRoutes}
                            history={history}
                            basePath={`/${demoName}`}
                        />
                    </Fragment>
                );
            }
            default:
                return <NotFound missingPath={missingPath} />;
        }
    }

    render() {
        return (
            <NavigationProvider
                history={history}
                routes={routes}
                onNavigateEnd={this.handleNavigateEnd}
                state={this.state.routing}
            >
                <Helmet titleTemplate="JARL Demos" />
                {this.renderDemo()}
            </NavigationProvider>
        );
    }
}

export default Root;
