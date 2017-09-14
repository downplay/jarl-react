import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";

const DEFAULT_BROWSERLESS_WIDTH = 1920;
const DEFAULT_BROWSERLESS_HEIGHT = 1080;

const DOM_RESIZE_EVENT = "resize";

const getState = (width, height) =>
    typeof window !== "undefined"
        ? {
              width: window.innerWidth,
              height: window.innerHeight
          }
        : {
              browserless: true,
              width,
              height
          };

const withViewport = ({
    browserlessWidth = DEFAULT_BROWSERLESS_WIDTH,
    browserlessHeight = DEFAULT_BROWSERLESS_HEIGHT
}) => Element => {
    const displayName = Element.displayName || Element.name || "Component";

    const Wrapped = class WithViewport extends Component {
        static displayName = `WithViewport(${displayName})`;
        static WrappedComponent = Element;

        state = getState();

        componentDidMount() {
            window.addEventListener(DOM_RESIZE_EVENT, this.handleResize);
        }

        componentWillUnmount() {
            window.removeEventListener(DOM_RESIZE_EVENT, this.handleResize);
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
