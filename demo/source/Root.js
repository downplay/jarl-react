import React, { Component } from "react";
import createHistory from "history/createBrowserHistory";
import { NavigationProvider } from "jarl-react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import * as demos from "./demos";

console.log(demos);

const splitPathBase = path => {
    const parts = path.split("/");
    return `/${parts[1]}`;
};

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
    {
        path: "/*:missingPath",
        state: { page: "notFound" }
    }
];

const history = createHistory();

/**
 * Custom top-level routing; routes to each separate demo and allows
 * them to act as self-contained sites.
 */
class Root extends Component {
    state = { routing: {} };

    handleNavigateEnd = (state, path) => {
        this.setState({
            routing: state,
            path
        });
    };

    renderDemo() {
        const { page, demoName, missingPath } = this.state.routing;
        switch (page) {
            case "index":
                return <Index basePath={splitPathBase(this.state.path)} />;
            case "demo": {
                const { Root: DemoRoot, routes: demoRoutes } = demos[demoName];
                return <DemoRoot routes={demoRoutes} history={history} />;
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
                {this.renderDemo()}
            </NavigationProvider>
        );
    }
}

export default Root;
