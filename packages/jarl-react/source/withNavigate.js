import React, { Component } from "react";

import { navigationContextShape } from "./NavigationProvider";
import hocFactory from "./hocFactory";

const withNavigateFactory = hocFactory(
    ({ options: mapper, WrappedComponent }) =>
        class WithNavigate extends Component {
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
);

export default withNavigateFactory;
