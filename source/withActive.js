import React, { Component } from "react";

import { navigationContextShape } from "./NavigationProvider";
import hocFactory from "./hocFactory";

const withActiveFactory = hocFactory(
    ({ WrappedComponent }) =>
        class WithActive extends Component {
            static contextTypes = {
                navigationContext: navigationContextShape
            };
            render() {
                const finalProps = { ...this.props };
                finalProps.active = this.props.to
                    ? this.context.navigationContext.isActive(this.props.to)
                    : false;
                return <WrappedComponent {...finalProps} />;
            }
        }
);

export default withActiveFactory;
