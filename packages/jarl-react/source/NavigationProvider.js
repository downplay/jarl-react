import { Component } from "react";
import PropTypes from "prop-types";
import invariant from "invariant";

import RouteMapper, { joinPaths } from "./RouteMapper";
import safeJsonStringify from "./tool/safeJsonStringify";
import { Redirect } from "./redirect";

export const navigationContextShape = PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    stringify: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
}).isRequired;

const ensureRouteMapper = routes =>
    routes instanceof RouteMapper ? routes : new RouteMapper(routes);

export default class NavigationProvider extends Component {
    static propTypes = {
        routes: PropTypes.oneOfType([
            PropTypes.instanceOf(RouteMapper),
            PropTypes.array
        ]).isRequired,
        onNavigateStart: PropTypes.func,
        onNavigateEnd: PropTypes.func,
        state: PropTypes.object,
        history: PropTypes.object.isRequired,
        context: PropTypes.func,
        performInitialNavigation: PropTypes.bool,
        basePath: PropTypes.string
    };

    static defaultProps = {
        onNavigateStart: null,
        onNavigateEnd: null,
        state: null,
        context: () => ({}),
        performInitialNavigation: true,
        basePath: ""
    };

    static childContextTypes = { navigationContext: navigationContextShape };

    constructor(props) {
        super(props);
        // TODO: Move all the invariants to NavigationProvider?
        invariant(
            props.routes &&
                (props.routes instanceof RouteMapper ||
                    Array.isArray(props.routes)),
            "Invalid routes property: must be an array or a RouteMapper instance"
        );
        invariant(props.history, "Provider must receive a history object");
        this.state = {
            routes: ensureRouteMapper(props.routes)
        };
    }

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
        if (this.props.performInitialNavigation) {
            this.doNavigation(this.getCurrentPath());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.routes !== this.props.routes) {
            this.setState(
                {
                    routes: ensureRouteMapper(nextProps.routes)
                },
                () => {
                    // Note: performInitialNavigation is intentionally ignored, if a different
                    // set of routes are loaded then we definitely need to resolve data etc
                    this.doNavigation(this.getCurrentPath());
                }
            );
        }
        if (nextProps.history !== this.props.history) {
            this.unlisten();
            this.unlisten = this.props.history.listen(this.handleHistory);
        }
    }

    componentWillUnmount() {
        this.unlisten();
    }

    getCurrentPath(
        path = this.props.history.location.pathname +
            this.props.history.location.search
    ) {
        invariant(
            path.indexOf(this.props.basePath) === 0,
            `The 'basePath' property must be found at the start of the current path in history. Received: '${path}'`
        );
        // TODO: Also merge query string
        return joinPaths(path.substring(this.props.basePath.length));
    }

    handleHistory = (location, action) => {
        this.doNavigation(
            this.getCurrentPath(location.pathname + location.search)
        );
    };

    handleNavigation = to => {
        const url = typeof to === "string" ? to : this.handleStringify(to);
        invariant(url, `Could not stringify state: ${safeJsonStringify(to)}`);
        this.props.history.push(url);
    };

    doNavigation(path) {
        const { branch, state } = this.state.routes.match(
            path,
            this.props.context()
        );
        invariant(state, `Unmatched URL '${path}'`);
        // Check for and follow redirects
        if (state instanceof Redirect) {
            this.handleNavigation(state.to);
            return;
        }
        // Complete navigation
        let promise = Promise.resolve();
        if (this.props.onNavigateStart) {
            promise =
                this.props.onNavigateStart(state, path, branch) || promise;
        }
        const promises = [promise];
        // Run any resolvers on the route branch
        // TODO: (Serious) no results of resolve are actually being used yet!
        for (const leaf of branch) {
            if (leaf.resolve) {
                promises.push(
                    leaf.resolve(state, this.props.context()).then(
                        // Convert redirect into a Promise rejection, this
                        // ensures that the Promise chain is broken after a redirect
                        result =>
                            result instanceof Redirect
                                ? Promise.reject(result)
                                : result
                    )
                );
            }
        }
        // Wait for all promises to resolve, then navigation is over
        Promise.all(promises)
            .then(() => {
                if (this.props.onNavigateEnd) {
                    this.props.onNavigateEnd(state, path, branch);
                }
            })
            .catch(error => {
                // If a redirect was thrown, follow it
                if (error instanceof Redirect) {
                    this.handleNavigation(error.to);
                } else if (this.props.onNavigateError) {
                    // Otherwise send to error handler
                    this.props.onNavigateError({ error, state, path, branch });
                } else {
                    // Unable to complete navigation, error not handled
                    /* eslint-disable no-console */
                    console.error(
                        `Unhandled resolve failure during navigation to ${path}.
                         Handle the resolve with a redirect instead.`
                    );
                    console.error(error);
                    /* eslint-enable no-console */
                }
            });
    }

    handleStringify = state => {
        const stringified =
            typeof state === "string"
                ? state
                : this.state.routes.stringify(state, this.props.state);
        return joinPaths(this.props.basePath, stringified);
    };

    handleGetState = () => this.props.state;

    // TODO: Support partial paths (optionally)
    handleIsActive = state =>
        this.handleStringify(state) === this.handleStringify(this.props.state);

    render() {
        return this.props.children || null;
    }
}
