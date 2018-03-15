import React, { Component } from "react";

import RoutingProvider from "./RoutingProvider";

/**
 * An out-of-the-box provider using local component state
 */
class StateProvider extends Component {
    /**
     * Initalise route mapper and setup state from current URL
     */
    constructor(props) {
        super(props);
        this.state = { location: {} };
    }

    /**
     * Use local component state to store navigation state
     */
    handleChange = event => {
        // TODO: Handle cancellation gracefully, with demo, also a redux example using isDirty in reducer
        // Want to cancel it in onChange or from routing? Maybe both.
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        this.setState({ location: event.location });
    };

    render() {
        const { ...others } = this.props;

        return (
            <RoutingProvider
                {...others}
                location={this.state.location}
                onChange={this.handleChange}
            />
        );
    }
}

export default StateProvider;
