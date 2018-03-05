import React, { Component } from "react";

import { navigationContextShape } from "./RoutingProvider";
import hocFactory from "./hocFactory";

const withNavigateFactory = hocFactory(
    ({ options: mapper, WrappedComponent }) =>
        class WithNavigate extends Component {
            static contextTypes = {
                navigationContext: navigationContextShape
            };

            mapToNavigateFunction() {
                const { navigate } = this.context.navigationContext;
                if (typeof mapper === "object") {
                    const mapped = {};
                    for (const key of Object.keys(mapper)) {
                        mapped[key] = () => navigate(mapper[key]);
                    }
                    return mapped;
                }
                return mapper(navigate, this.props);
            }

            render() {
                const generatedProps = mapper
                    ? this.mapToNavigateFunction()
                    : {
                          navigate: this.context.navigationContext.navigate
                      };
                return <WrappedComponent {...this.props} {...generatedProps} />;
            }
        }
);

export default withNavigateFactory;
