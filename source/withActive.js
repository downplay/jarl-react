import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";

import { navigationContextShape } from "./NavigationProvider";

const withActiveFactory = () => WrappedComponent => {
    class WithActive extends Component {
        static contextTypes = {
            navigationContext: navigationContextShape
        };
        render() {
            const finalProps = { ...this.props };
            finalProps.active = this.props.to ? this.context.navigationContext.isActive(this.props.to) : false;
            return <WrappedComponent {...finalProps} />;
        }
    }

    WithActive.WrappedComponent = WrappedComponent;
    WithActive.displayName = `WithActive(${WrappedComponent.displayName})`;

    return hoistStatics(WithActive, WrappedComponent);
};

export default withActiveFactory;
