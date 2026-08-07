import React, { Component } from "react";

import RoutingProvider, { RoutingProviderProps, NavigationOutput } from "./RoutingProvider";
import { Location } from "./types";

export type StateProviderProps = Omit<
    RoutingProviderProps,
    "location" | "resolved" | "onChange"
> & {
    onChange?: (event: NavigationOutput) => void;
};

export interface StateProviderState {
    location: Location;
    resolved: Location;
}

/**
 * An out-of-the-box provider using local component state
 */
class StateProvider extends Component<StateProviderProps, StateProviderState> {
    /**
     * Initalise route mapper and setup state from current URL
     */
    constructor(props: StateProviderProps) {
        super(props);
        this.state = { location: {}, resolved: {} };
    }

    /**
     * Use local component state to store navigation state
     */
    handleChange = (event: NavigationOutput): void => {
        // TODO: Handle cancellation gracefully, with demo, also a redux example using isDirty in reducer
        // Want to cancel it in onChange or from routing? Maybe both.
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        this.setState({
            location: event.location as Location,
            resolved: event.resolved
        });
    };

    render() {
        const { ...others } = this.props;

        return (
            <RoutingProvider
                {...others}
                location={this.state.location}
                resolved={this.state.resolved}
                onChange={this.handleChange}
            />
        );
    }
}

export default StateProvider;
