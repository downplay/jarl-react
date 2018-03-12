import React, { Component } from "react";

/**
 *
 */
class Transition extends Component {
    render() {
        const {
            location,
            destination,
            enter,
            exit
        } = this.context.routingTransitions.getState();
        const current = this.props.children({ location, enter });
        const next = destination && this.props.children({ destination, exit });

        return next ? [current, next] : current;
    }
}

export default Transition;
