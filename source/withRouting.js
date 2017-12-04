import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";

import { navigationContextShape } from "./NavigationProvider";

const withRoutingFactory = (mapper) => WrappedComponent => {
    class WithRouting extends Component {
        static contextTypes = {
            navigationContext: navigationContextShape
        };
        render() {
            let generatedProps = {
                navigate: this.context.navigationContext.navigate
            };
            if (mapper) {
                generatedProps = mapper(generatedProps);
            }
            return <WrappedComponent {...this.props} {...generatedProps} />;
        }
    }

    WithRouting.WrappedComponent = WrappedComponent;
    WithRouting.displayName = `WithRouting(${WrappedComponent.displayName})`;

    return hoistStatics(WithRouting, WrappedComponent);
};

export default withRoutingFactory;
