import React, { Component } from "react";

import { History } from "history";
import { StateProvider } from "jarl-react";

import routes from "./routes";
import Pages from "./Pages";

interface RootProps {
    history: History;
    basePath?: string;
}

class Root extends Component<RootProps> {
    render() {
        const { history, basePath } = this.props;
        return (
            <StateProvider history={history} routes={routes} basePath={basePath}>
                <Pages />
            </StateProvider>
        );
    }
}

export default Root;
