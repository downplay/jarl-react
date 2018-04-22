import React, { Component } from "react";

import { StateProvider } from "jarl-react";

import routes from "./routes";
import Pages from "./Pages";

class Root extends Component {
    render() {
        const { history, basePath } = this.props;
        return (
            <StateProvider
                history={history}
                routes={routes}
                basePath={basePath}
            >
                <Pages />
            </StateProvider>
        );
    }
}

export default Root;
