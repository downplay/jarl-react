import React, { Component } from "react";

// WIP / unfinished feature: relies on a `routingTransitions` context value that
// isn't actually provided anywhere else in this codebase yet. Typed loosely
// (`any`) throughout rather than inventing an API surface for functionality
// that was never completed - this is a straight port, not a design exercise.

/**
 *
 */
class Transition extends Component<{ children: (props: any) => any }> {
    render() {
        const { location, destination, enter, exit } = (
            this.context as any
        ).routingTransitions.getState();
        const current = this.props.children({ location, enter });
        const next = destination && this.props.children({ destination, exit });

        return next ? [current, next] : current;
    }
}

export default Transition;
