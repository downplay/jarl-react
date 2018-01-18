import React, { Component } from "react";
import createHistory from "history/createBrowserHistory";
import { NavigationProvider } from "jarl-react";

const routes = [
    {
        path: "/",
        state: { page: "index" }
    }
];

const history = createHistory();

/**
 * Custom top-level routing; routes to each separate demo and allows
 * them to act as self-contained sites.
 */
class Root extends Component {
    state = {};

    handleNavigateEnd = (state, path) => {
        this.setState({
            routing: state,
            path
        });
    };

    renderDemo() {
        switch (this.state.page) {
            case "index":
                return <Index />;
            default:
                return <NotFound />;
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
