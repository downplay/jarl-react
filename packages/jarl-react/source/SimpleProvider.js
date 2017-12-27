import React, { Component } from "react";
import PropTypes from "prop-types";

import NavigationProvider from "./NavigationProvider";
import RouteMapper from "./RouteMapper";

export default class SimpleProvider extends Component {
    static propTypes = {
        routes: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.instanceOf(RouteMapper)
        ]).isRequired,
        history: PropTypes.object.isRequired
    };

    /**
     * Initalise route mapper and setup state from current URL
     */
    constructor(props) {
        super(props);
        this.state = { navigationState: {} };
        this.ensureRouteMapper(props.routes);
        const path = props.history.location.pathname;
        const match = this.routeMapper.match(path);
        if (match) {
            // Mutation here is fine while setting up initial state
            this.state.navigationState = match.state;
        }
    }

    /**
     * If different routes passed in for any reason, make sure
     * we use the right RouteMapper
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.routes !== this.props.routes) {
            this.ensureRouteMapper(nextProps.routes);
        }
    }

    /**
     * Use local component state to store navigation state
     */
    handleNavigateEnd = state => {
        this.setState({ navigationState: state });
    };

    ensureRouteMapper = routes => {
        this.routeMapper =
            routes instanceof RouteMapper ? routes : new RouteMapper(routes);
    };

    render() {
        const { children, history } = this.props;

        return (
            <NavigationProvider
                history={history}
                routes={this.routeMapper}
                state={this.state.navigationState}
                onNavigateEnd={this.handleNavigateEnd}
            >
                {children}
            </NavigationProvider>
        );
    }
}
