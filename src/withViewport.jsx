import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";

// Define some constants
const DEFAULT_BROWSERLESS_WIDTH = 1920;
const DEFAULT_BROWSERLESS_HEIGHT = 1080;

const DOM_RESIZE_EVENT = "resize";

let handledRehydration = false;
let handlingRehydration = false;

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
        state = this.getState();

        componentDidMount() {
            // Bind resize listener
            window.addEventListener(DOM_RESIZE_EVENT, this.handleResize);
            // SSR rehydration support
            // On the very first render, which we assume is for the rehydration run through,
            // use the server default (in getState). Then trigger an actual resize and
            // set the handled flag so this path is never touched again.
            // Note: Some fragility here. This works for the typical SSR use case
            // where rehydration only ever happens once, synchronously and globally.
            // I can't think of the scenario where this would break but someone can
            // prove me wrong.
            if (!handleRehydration || handledRehydration) {
                return;
            }
            if (!handlingRehydration) {
                handlingRehydration = true;
                setImmediate(() => {
                    handledRehydration = true;
                    this.handleResize();
                });
            } else {
                setImmediate(this.handleResize);
            }
        }

        componentWillUnmount() {
            // Unbind resize listener when component unmounts
            window.removeEventListener(DOM_RESIZE_EVENT, this.handleResize);
        }

        // Gets either the real or fake width and height
        getState(width, height) {
            let ignoreWindow = false;
            if (!handledRehydration && handleRehydration) {
                ignoreWindow = true;
            }

            // Return the actual state that will be injected into props
            return !ignoreWindow && typeof window !== "undefined"
                ? {
                      width: window.innerWidth,
                      height: window.innerHeight
                  }
                : {
                      browserless: true,
                      width: browserlessWidth,
                      height: browserlessHeight
                  };
        }

        // Update local state on resize
        handleResize = () => {
            this.setState(this.getState());
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
