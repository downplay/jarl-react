import React, { Component } from "react";
import createHistory from "history/createBrowserHistory";
import { NavigationProvider } from "jarl-react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const splitPathBase = path => {
    const parts = path.split("/");
    const [empty, base] = parts;
    return `/${base}`;
};

const routes = [
    {
        path: "/",
        state: { page: "index" }
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
        switch (this.state.routing.page) {
            case "index":
                return <Index basePath={splitPathBase(this.state.path)} />;
            default:
                return (
                    <NotFound missingPath={this.state.routing.missingPath} />
                );
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
