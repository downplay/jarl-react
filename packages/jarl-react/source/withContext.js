import React, { Component } from "react";

import { navigationContextShape } from "./NavigationProvider";
import hocFactory from "./hocFactory";

const withContextFactory = hocFactory(
    ({ options: mapper, WrappedComponent }) =>
        class WithContext extends Component {
            static contextTypes = {
                navigationContext: navigationContextShape
            };
            render() {
                const finalProps = { ...this.props };
                finalProps.active = this.props.to
                    ? this.context.navigationContext.isActive(this.props.to)
                    : false;
                const contextProps = mapper
                    ? mapper(this.context.navigationContext)
                    : this.context.navigationContext;

                return <WrappedComponent {...contextProps} {...this.props} />;
            }
        }
);

export default withContextFactory;
