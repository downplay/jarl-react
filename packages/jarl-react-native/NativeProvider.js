import React, { Component } from "react";
import PropTypes from "prop-types";
import { RoutingProvider } from "jarl-react";
import { createMemoryHistory } from "history";
import { BackHandler } from "react-native";

/**
 * A routing provider specialised for React Native. Creates a memory history if
 * one isn't provided, and adds back button support
 */
class NativeProvider extends Component {
    static propTypes = {
        /**
         * Whether to listen for hardwareBackPress events to trigger navigation
         * (Android only)
         */
        handleBackButton: PropTypes.bool,
        /**
         * Optional. The provider will create its own memory history but
         * you can provide your own if you need direct access to its API
         */
        history: PropTypes.object
    };

    static defaultProps = {
        handleBackButton: true,
        history: null
    };

    constructor(props) {
        super(props);
        // Create a default memory history if none provided
        this.history = props.history || createMemoryHistory();
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    }

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
        return <RoutingProvider {...this.props} history={this.history} />;
    }
}

export default NativeProvider;
