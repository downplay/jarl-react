import React, { Component } from "react";

import NavigationProvider from "./NavigationProvider";

export default class SimpleProvider extends Component {
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
    handleNavigateEnd = state => {
        this.setState({ navigationState: state });
    };

    render() {
        const { ...others } = this.props;

        return (
            <NavigationProvider
                {...others}
                state={this.state.navigationState}
                onNavigateEnd={this.handleNavigateEnd}
            />
        );
    }
}
