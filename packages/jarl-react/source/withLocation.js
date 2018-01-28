import React, { Component } from "react";

import { navigationContextShape } from "./NavigationProvider";
import hocFactory from "./hocFactory";

const noop = state => state;

const withLocationFactory = hocFactory(
    ({ options: mapStateToProps = noop, WrappedComponent }) =>
        class WithLocation extends Component {
            static contextTypes = {
                navigationContext: navigationContextShape
            };
            render() {
                const state = this.context.navigationContext.getState();
                // TODO: Some redux-like optimisation when state changes
                return (
                    <WrappedComponent
                        {...this.props}
                        {...mapStateToProps(state)}
                    />
                );
            }
        }
);

export default withLocationFactory;
