import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";

const DEFAULT_BROWSERLESS_WIDTH = 1920;
const DEFAULT_BROWSERLESS_HEIGHT = 1080;

const getState = () =>
    typeof window !== "undefined"
        ? {
              width: window.innerWidth,
              height: window.innerHeight
          }
        : {
              browserless: true,
              width: DEFAULT_BROWSERLESS_WIDTH,
              height: DEFAULT_BROWSERLESS_HEIGHT
          };

const withViewport = () => Element => {
    const displayName = Element.displayName || Element.name || "Component";

    const Wrapped = class WithViewport extends Component {
        static displayName = `WithViewport(${displayName})`;
        static WrappedComponent = Element;

        state = getState();

        componentDidMount() {
            window.addEventListener("resize", this.handleResize);
        }

        componentWillUnmount() {
            window.removeEventListener("resize", this.handleResize);
        }

        handleResize = () => {
            this.setState(getState());
        };

        render() {
            const { children, ...others } = this.props;
            return (
                <Element
                    {...others}
                    viewportWidth={this.state.width}
                    viewportHeight={this.state.height}
                >
                    {children}
                </Element>
            );
        }
    };
    hoistStatics(Wrapped, Element);
    return Wrapped;
};

export default withViewport;
