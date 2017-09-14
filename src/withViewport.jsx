import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";

// Define some constants
const DEFAULT_BROWSERLESS_WIDTH = 1920;
const DEFAULT_BROWSERLESS_HEIGHT = 1080;

const DOM_RESIZE_EVENT = "resize";

// Gets either the real or fake width and height
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

let handledRehydration = false;
let handlingRehyrdation = false;

// HOC signature
const withViewport = ({
    browserlessWidth = DEFAULT_BROWSERLESS_WIDTH,
    browserlessHeight = DEFAULT_BROWSERLESS_HEIGHT,
    handleRehydration = false
}) => Element => {
    // Get friendly display name to be shown in React devtools
    const displayName = Element.displayName || Element.name || "Component";

    // Generate the wrapped component class
    const Wrapped = class WithViewport extends Component {
        // For React devtools
        static displayName = `WithViewport(${displayName})`;
        static WrappedComponent = Element;

        // Initialize state
        state = getState();

        // Bind resize listener
        componentDidMount() {
            window.addEventListener(DOM_RESIZE_EVENT, this.handleResize);
        }

        // Unbind resize listener when component unmounts
        componentWillUnmount() {
            window.removeEventListener(DOM_RESIZE_EVENT, this.handleResize);
        }

        // Update local state on resize
        handleResize = () => {
            this.setState(getState(browserlessWidth, browserlessHeight));
        };

        render() {
            const { children, ...others } = this.props;
            // Pass props onto wrapped element
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
    // Lift any static methods
    hoistStatics(Wrapped, Element);
    return Wrapped;
};

export default withViewport;
