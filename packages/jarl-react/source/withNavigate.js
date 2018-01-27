import React, { Component } from "react";

import { navigationContextShape } from "./NavigationProvider";
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
                // TODO: Optimise that generatedProps is a new object
                // every render
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
