import React, { Component } from "react";

import RoutingProvider from "./RoutingProvider";

export default class StateProvider extends Component {
    /**
     * Initalise route mapper and setup state from current URL
     */
    constructor(props) {
        super(props);
        this.state = { navigationState: {} };
    }

    /**
     * Use local component state to store navigation state
     */
    handleNavigateEnd = event => {
        this.setState({ navigationState: event.state });
        if (this.props.onNavigateEnd) {
            this.props.onNavigateEnd(event);
        }
    };

    render() {
        const { ...others } = this.props;

        return (
            <RoutingProvider
                {...others}
                state={this.state.navigationState}
                onNavigateEnd={this.handleNavigateEnd}
            />
        );
    }
}
