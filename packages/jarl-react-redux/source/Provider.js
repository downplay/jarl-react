import React, { Component } from "react";
import invariant from "invariant";

import { NavigationProvider, RouteMapper } from "jarl-react";

import { navigateStart, navigateEnd, navigateTransitionIn } from "./actions";

class Provider extends Component {
    /**
     * Initalise route mapper and setup state from current URL
     */
    constructor(props) {
        super(props);
        invariant(props.store, "Provider must receive a store");
        invariant(
            typeof props.store.getState === "function",
            "Provider must be given a Redux store"
        );
    }

    getNavigationState() {
        const { store, reducerMountPoint = "navigation" } = this.props;
        return store.getState()[reducerMountPoint];
    }

    handleNavigateStart = state => {
        this.props.store.dispatch(navigateStart(state));
        if (this.props.onNavigateStart) {
            return this.props.onNavigateStart(state);
        }
        return null;
    };

    handleNavigateEnd = state => {
        this.props.store.dispatch(navigateEnd(state));
        setTimeout(() => {
            this.props.store.dispatch(navigateTransitionIn(state));
        }, 1);
    };

    render() {
        const { store, ...others } = this.props;
        const navigation = this.getNavigationState();
        return (
            <NavigationProvider
                {...others}
                state={navigation}
                onNavigateStart={this.handleNavigateStart}
                onNavigateEnd={this.handleNavigateEnd}
                context={() => ({
                    dispatch: store.dispatch,
                    getState: store.getState
                })}
            />
        );
    }
}

export default Provider;
