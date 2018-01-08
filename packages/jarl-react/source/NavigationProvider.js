import { Component } from "react";
import PropTypes from "prop-types";

import RouteMapper from "./RouteMapper";

export const navigationContextShape = PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    stringify: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
}).isRequired;

export const safeJsonStringify = o => {
    try {
        return JSON.stringify(o);
    } catch (e) {
        return "[Circular reference]";
    }
};

export default class NavigationProvider extends Component {
    static propTypes = {
        routes: PropTypes.instanceOf(RouteMapper).isRequired,
        onNavigateStart: PropTypes.func,
        onNavigateEnd: PropTypes.func,
        state: PropTypes.object,
        history: PropTypes.object.isRequired,
        context: PropTypes.func
    };

    static defaultProps = {
        onNavigateStart: null,
        onNavigateEnd: null,
        state: null,
        context: () => ({})
    };

    static childContextTypes = { navigationContext: navigationContextShape };

    getChildContext() {
        return {
            navigationContext: {
                navigate: this.handleNavigation,
                stringify: this.handleStringify,
                getState: this.handleGetState,
                isActive: this.handleIsActive
            }
        };
    }

    componentDidMount() {
        // Listen for changes to the current location
        this.unlisten = this.props.history.listen(this.handleHistory);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.history !== this.props.history) {
            this.unlisten();
            this.unlisten = this.props.history.listen(this.handleHistory);
        }
    }

    componentWillUnmount() {
        this.unlisten();
    }

    handleHistory = (location, action) => {
        this.doNavigation(location.pathname);
    };

    handleNavigation = to => {
        const url = typeof to === "string" ? to : this.handleStringify(to);
        if (!url) {
            throw new Error(
                `Could not stringify state: ${safeJsonStringify(to)}`
            );
        }
        this.props.history.push(url);
    };

    doNavigation = url => {
        const { branch, state } = this.props.routes.match(url);
        let promise = Promise.resolve();
        if (this.props.onNavigateStart) {
            promise = this.props.onNavigateStart(state, url) || promise;
        }
        const promises = [promise];
        for (const leaf of branch) {
            if (leaf.route.data) {
                promises.push(leaf.route.data(this.props.context()));
            }
        }
        // TODO: Gather branch data and perform auth
        Promise.all(promises).then(() => {
            if (this.props.onNavigateEnd) {
                this.props.onNavigateEnd(state, url);
            }
        });
    };

    handleStringify = state =>
        this.props.routes.stringify(state, this.props.state);

    handleGetState = () => this.props.state;

    // TODO: Support partial paths (optionally)
    handleIsActive = state =>
        this.handleStringify(state) === this.handleStringify(this.props.state);

    render() {
        return this.props.children;
    }
}
