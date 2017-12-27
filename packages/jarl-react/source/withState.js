import React, { Component } from "react";

import { navigationContextShape } from "./NavigationProvider";
import hocFactory from "./hocFactory";

const withStateFactory = hocFactory(
    ({ options: mapStateToProps, WrappedComponent }) =>
        class WithState extends Component {
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
        },
    () => state => state
);

export default withStateFactory;
