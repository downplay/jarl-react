import React, { Component } from "react";

import { StateProvider } from "jarl-react";

import routes from "./routes";
import Pages from "./Pages";

class Root extends Component {
    /** This will hold the dynamically loaded component */
    state = { Page: null };

    /**
     * We handle the onChange callback from JARL because objects
     * resolved during routing are available on the `resolved` key
     */
    onChange = ({ resolved }) => {
        // Store it in state
        this.setState({ Page: resolved.Page });
    };

    render() {
        const { history, basePath } = this.props;
        return (
            <StateProvider
                history={history}
                routes={routes}
                basePath={basePath}
                onChange={this.handleChange}
            >
                {/* Pass it into our app to be rendered */}
                <Pages Page={this.state.Page} />
            </StateProvider>
        );
    }
}

export default Root;
