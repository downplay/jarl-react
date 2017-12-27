import React, { Component } from "react";
import { NavigationProvider } from "jarl-react";

import { navigateStart, navigateEnd, navigateTransitionIn } from "./actions";

class Provider extends Component {
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
        const {
            store,
            history,
            routeMapper,
            children,
            reducerMountPoint = "navigation"
        } = this.props;
        const navigation = store.getState()[reducerMountPoint];
        return (
            <NavigationProvider
                routes={routeMapper}
                state={navigation}
                history={history}
                onNavigateStart={this.handleNavigateStart}
                onNavigateEnd={this.handleNavigateEnd}
                context={() => ({
                    store: this.props.store
                })}
            >
                {children}
            </NavigationProvider>
        );
    }
}

export default Provider;
