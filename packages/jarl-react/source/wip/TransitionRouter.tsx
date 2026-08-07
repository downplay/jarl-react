import React, { Component, ReactNode } from "react";
// WIP / unfinished feature. The original JS imported from the built "../es/index"
// output rather than source, which only worked post-build; corrected to import
// from the actual source entry point so this typechecks (see ticket 52 PR notes).
import { RoutingProvider } from "../index";

class TransitionRouter extends Component<{ children?: ReactNode }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleChange = ({ route, branch }: any): void => {
        // Beginning a transition between two routes
    };

    render() {
        // Cast to `any`: this WIP component never supplied the (now required)
        // `routes`/`history` props even before this conversion - preserved as-is.
        const Provider: any = RoutingProvider;
        return (
            <Provider onChange={this.handleChange}>{this.props.children}</Provider>
        );
    }
}

export default TransitionRouter;
