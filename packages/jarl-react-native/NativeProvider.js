import React, { Component } from "react";
import PropTypes from "prop-types";
import { RoutingProvider } from "jarl-react";
import { createMemoryHistory } from "history";
import { BackHandler } from "react-native";

class NativeProvider extends Component {
    static propTypes = {
        /** Whether to listen for hardwareBackPress events to trigger navigation */
        handleBackButton: PropTypes.bool,
        /**
         * Optional. The provider will create its own memory history but
         * you can provider your own if you want access directly to its API
         */
        history: PropTypes.object
    };

    static defaultProps = {
        handleBackButton: true,
        history: null
    };

    constructor(props) {
        super(props);
        this.history = props.history || createMemoryHistory();
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    }

    handleBack = () => {
        const { history } = this.context.router;

        if (history.index === 0) {
            return false; // home screen
        }
        history.goBack();
        return true;
    };

    render() {
        return <RoutingProvider {...this.props} history={this.history} />;
    }
}

export default NativeProvider;
