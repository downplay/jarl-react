import React, { Component } from "react";
import PropTypes from "prop-types";
import { RoutingProvider } from "jarl-react";
import { createMemoryHistory } from "history";
import { BackHandler, Linking } from "react-native";

// Strip protocol from URL
const regex = /.*?:\/\//g;

/**
 * A routing provider specialised for React Native. Creates a memory history if
 * one isn't provided, and includes optional back button support.
 */
class NativeProvider extends Component {
    static propTypes = {
        /**
         * Whether to listen for hardwareBackPress events to trigger navigation
         * (Android only)
         */
        handleBackButton: PropTypes.bool,
        /**
         * Whether to handle initial deep linking and navigate on URL events
         * @see https://facebook.github.io/react-native/docs/linking.html
         */
        handleDeepLinking: PropTypes.bool,
        /**
         * Optional. The provider will create its own memory history but
         * you can provide your own if you need direct access to its API
         */
        history: PropTypes.object
    };

    static defaultProps = {
        handleBackButton: true,
        handleDeepLinking: true,
        history: null
    };

    constructor(props) {
        super(props);
        // Create a default memory history if none provided
        this.history = props.history || createMemoryHistory();
    }

    componentDidMount() {
        // Note: Changing either prop at runtime is not supported
        // Support back button
        if (this.props.handleBackButton) {
            BackHandler.addEventListener("hardwareBackPress", this.handleBack);
        }
        // Deep links
        if (this.props.handleDeepLinking) {
            Linking.getInitialURL()
                .then(this.openUrl)
                .catch(err =>
                    // eslint-disable-next-line no-console
                    console.error(
                        "Error in NativeRouting while getting initial URL for deep linking",
                        err
                    )
                );
            Linking.addEventListener("url", this.handleUrl);
        }
    }

    componentWillUnmount() {
        // Clean up
        BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
        Linking.removeEventListener("url", this.handleUrl);
    }

    handleUrl = event => this.openUrl(event.url);

    openUrl = url => {
        const path = url.replace(regex, "");
        this.history.push(path);
    };

    handleBack = () => {
        const { history } = this;
        if (history.index === 0) {
            // Returning false goes to home screen
            return false;
        }
        history.goBack();
        return true;
    };

    render() {
        const { handleBackButton, handleDeepLinking, ...rest } = this.props;
        return <RoutingProvider {...rest} history={this.history} />;
    }
}

export default NativeProvider;
