import React, { Component } from "react";

import { navigationContextShape } from "./RoutingProvider";
import hocFactory from "./hocFactory";

/**
 * Higher-order component to inject functions from the RoutingProvider's context
 *
 * Functions injected:
 *
 * - stringify(to): stringifies a state object into a URL
 * - navigate(to): initiates navigation to a state, using history.push()
 * - getState(): gets the current location state
 */
const withContextFactory = hocFactory(
    ({ options: mapper, WrappedComponent }) =>
        class WithContext extends Component {
            static contextTypes = {
                navigationContext: navigationContextShape
            };
            render() {
                const contextProps = mapper
                    ? mapper(this.context.navigationContext)
                    : this.context.navigationContext;

                return <WrappedComponent {...contextProps} {...this.props} />;
            }
        }
);

export default withContextFactory;
