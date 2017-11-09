import { Component } from "react";
import PropTypes from "prop-types";

import RouteMapper from "./RouteMapper";

export const navigationContextShape = PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    resolve: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
}).isRequired;

export default class NavigationProvider extends Component {
    static propTypes = {
        routes: PropTypes.instanceOf(RouteMapper).isRequired,
        onNavigateStart: PropTypes.func,
        onNavigateEnd: PropTypes.func,
        state: PropTypes.object,
        history: PropTypes.object.isRequired
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
                resolve: this.handleResolve,
                getState: this.handleGetState,
                isActive: this.handleIsActive
            }
        };
    }

    componentDidMount() {
        // Listen for changes to the current location.
        this.unlisten = this.props.history.listen(this.handleHistory);
    }

    componentWillUnmount() {
        this.unlisten();
    }

    handleHistory = (location, action) => {
        this.doNavigation(location.pathname);
    };

    handleNavigation = url => {
        this.props.history.push(url);
    };

    doNavigation = url => {
        const { branch, state } = this.props.routes.match(url);
        let promise = Promise.resolve();
        if (this.props.onNavigateStart) {
            promise = this.props.onNavigateStart(state) || promise;
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
                this.props.onNavigateEnd(state);
            }
        });
    };

    handleResolve = state => this.props.routes.resolve(state, this.props.state);

    handleGetState = () => this.props.state;

    // TODO: Support partial paths (optionally)
    handleIsActive = state => this.props.history.location.pathname === this.handleResolve(state);
    // TODO: Ideally would check against the results of two resolutions instead of just the current url.
    // Also the use of "state" is slightly conflicting with a) redux/react state, and b) browser history state
    // which is yet another thing. Might be better to call this "context"? "datums"?
    // This version didn't work because right now optional state parts cause resolution to fail;
    // {page: "contact"} resolves to /contact but {page: "contact", site: "main"} doesn't resolve to anything.
    // Maybe I should be handling this a much simpler way but it should be easy to create similar scenarios
    // without breaking everything.
    // return this.handleResolve(state) === this.handleResolve(this.props.state);

    render() {
        return this.props.children;
    }
}
