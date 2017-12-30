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
                const generatedProps = {
                    navigate: this.context.navigationContext.navigate
                };
                return (
                    <WrappedComponent
                        {...this.props}
                        {...mapper(generatedProps)}
                    />
                );
            }
        },
    () => state => state
);

export default withNavigateFactory;
