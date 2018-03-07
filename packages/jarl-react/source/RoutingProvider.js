import { Component } from "react";
import PropTypes from "prop-types";
import invariant from "invariant";

import RouteMapper, { joinPaths, hydrateRoute } from "./RouteMapper";
import safeJsonStringify from "./lib/safeJsonStringify";
import { Redirect } from "./redirect";

export const routingContextShape = PropTypes.shape({
    isActive: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    stringify: PropTypes.func.isRequired,
    getLocation: PropTypes.func.isRequired
}).isRequired;

/** Action type on initial navigation. */
export const ACTION_INITIAL = "INITIAL";
/** Action type when routes are reloaded. */
export const ACTION_RELOAD = "RELOAD";

const ensureRouteMapper = routes =>
    routes instanceof RouteMapper ? routes : new RouteMapper(routes);

/**
 * The RoutingProvider provides routing functionality to the entire app or a subtree
 * of it, using React's context. The RoutingProvider should normally be wrapped around
 * the top level of the app. Its presence is required by `Link`, `Router`, and the
 * `routing` HOC.
 */
class RoutingProvider extends Component {
    static propTypes = {
        /** An array of Routes, or a RouteMap instance. */
        routes: PropTypes.oneOfType([
            PropTypes.instanceOf(RouteMapper),
            PropTypes.array
        ]).isRequired,
        onNavigateStart: PropTypes.func,
        onNavigateEnd: PropTypes.func,
        state: PropTypes.object,
        history: PropTypes.object.isRequired,
        context: PropTypes.func,
        /**
         * If true, will check the current location from `history` and fire an
         * onRoute lifecycle when the provider first mounts.
         */
        performInitialNavigation: PropTypes.bool,
        /**
         * Specify a basePath that this router should operate inside. This will
         * have the effect of stripping this path from the beginning of the URL
         * during routing, and prepending the path to the URL during path creation.
         * If the base path is *not* found during a routing event then the routing
         * event will simply be ignored.
         */
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

    static childContextTypes = { routing: routingContextShape };

    constructor(props) {
        super(props);
        // TODO: Move all the invariants to RoutingProvider?
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
            routing: {
                navigate: this.handleNavigation,
                redirect: this.handleRedirect,
                stringify: this.handleStringify,
                getLocation: this.handleGetLocation,
                isActive: this.handleIsActive
            }
        };
    }

    componentDidMount() {
        // Listen for changes to the current location
        this.unlisten = this.props.history.listen(this.handleHistory);
        const path = this.getCurrentPath();
        if (this.props.performInitialNavigation && this.hasBasePath(path)) {
            this.doNavigation(this.normalizePath(path), ACTION_INITIAL);
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
                    // TODO: Test for this
                    const path = this.getCurrentPath();
                    if (this.hasBasePath(path)) {
                        this.doNavigation(
                            this.normalizePath(path),
                            ACTION_RELOAD
                        );
                    }
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

    getCurrentPath() {
        // TODO: This seems like a source of bugs since during navigation this is now
        // incorrect. Source of truth error. Probably need to actually store the real current path
        // in state or maybe private field.
        return (
            this.props.history.location.pathname +
            this.props.history.location.search
        );
    }

    hasBasePath(path) {
        return path.indexOf(this.props.basePath) === 0;
    }

    normalizePath(path) {
        // TODO: Also merge query string
        return joinPaths(path.substring(this.props.basePath.length));
    }

    handleHistory = (location, action) => {
        const path = location.pathname + location.search;
        if (this.hasBasePath(path)) {
            this.doNavigation(this.normalizePath(path), action);
        }
    };

    ensureUrl(to) {
        const url = typeof to === "string" ? to : this.handleStringify(to);
        invariant(url, `Could not stringify state: ${safeJsonStringify(to)}`);
        return url;
    }

    handleRedirect = to => {
        // Redirect causes a replace instead of push, so the browser history doesn't
        // contain URLs we know to be invalid
        // TODO: Specific E2E test for this, and consider that in some cases this
        // might not be wanted - e.g. redirect from a Login page could be valid later
        // (but then we'd manually redirect back?)
        this.props.history.replace(this.ensureUrl(to));
    };

    handleNavigation = to => {
        this.props.history.push(this.ensureUrl(to));
    };

    doNavigation(path, action) {
        const { branch, state } = this.state.routes.match(
            path,
            this.props.context()
        );
        invariant(state, `Unmatched URL '${path}'`);
        // Check for and follow redirects
        if (state instanceof Redirect) {
            this.handleRedirect(state.to);
            return;
        }
        // Complete navigation
        let promise = Promise.resolve();
        if (this.props.onNavigateStart) {
            promise =
                this.props.onNavigateStart({ state, path, branch, action }) ||
                promise;
        }
        const promises = [promise];
        // Run any resolvers on the route branch
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
            .then(results => {
                // TODO: Not sure quite what to do about some resolve results, e.g.
                // resolving component imports. They shouldn't go into state but where
                // should they go?
                const finalState = results.reduce(
                    (prevState, result = {}) => ({ ...prevState, ...result }),
                    state
                );
                // TODO: Invariant if onNavigateEnd doesn't exist? PropTypes required?
                if (this.props.onNavigateEnd) {
                    this.props.onNavigateEnd({
                        state: finalState,
                        path,
                        branch,
                        action
                    });
                }
            })
            .catch(error => {
                // If a redirect was thrown, follow it
                if (error instanceof Redirect) {
                    this.handleRedirect(error.to);
                } else if (this.props.onNavigateError) {
                    // Otherwise send to error handler
                    this.props.onNavigateError({
                        error,
                        state,
                        path,
                        branch,
                        action
                    });
                } else {
                    // Unable to complete navigation, error not handled
                    // TODO: Throw error instead?
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

    handleGetLocation = () => this.props.state; // TODO

    handleIsActive = (stateOrPath, exact = false) => {
        // TODO: PERF: This has to do quite a bit of work. Consider memoization. Also
        // could cache the branch at the time of navigation but this could get out of date.
        // Also there is duplicated work: converting states to strings only
        // to convert them back to strings again! Not sure how this can be effectively
        // unravelled, but splitting the parser into smaller chunks might provide a way.
        // Maybe optimisation should happen in Link; could see issues when rendering
        // a lot of links.
        // "Exact" could also be a lot faster since that's just saying "is this the current
        // route".
        // A quick win would be caching active state per URL and busting the cache when we
        // navigate. Maybe beyond this we need a specialised traversal in addition to match
        // and stringify. (Would prob look more like stringify than match).

        // Determining if a link is "active" gets a little complicated (for the non-exact
        // case at least). We can't simply compare strings because 1) the link must
        // be an *actual* parent in the route hierarchy, whereas a `/` route that is merely
        // a sibling to a `/foo` route should *not* be considered active when on `/foo`;
        // and 2) query strings will completely break string matching since we need to
        // check if the right parts of the query string are there.
        // To do this we have to perform matching on both states and actually compare the
        // matched branches to see if one is a parent of (or the same as) the other.

        // Get the branch to be checked
        // TODO: Add a test that this works with basePathz
        const toPath = this.normalizePath(this.handleStringify(stateOrPath));
        const {
            branch: toBranch /* , state: toState */
        } = this.state.routes.match(toPath, this.props.context());

        // Check that the path is actually within our basePath
        if (!this.hasBasePath(toPath)) {
            return false;
        }

        // Get current branch
        const currentPath = this.normalizePath(
            this.handleStringify(this.props.state)
        );
        const { branch: currentBranch } = this.state.routes.match(
            currentPath,
            this.props.context()
        );

        // Can drop out quickly for obvious non-matches
        if (
            currentBranch.length === 0 ||
            toBranch.length === 0 ||
            currentBranch.length < toBranch.length ||
            (exact && toBranch.length !== currentBranch.length)
        ) {
            return false;
        }

        // Walk along the branch, if any leaves don't match then we're not active
        for (const i in toBranch) {
            if (toBranch[i] !== currentBranch[i]) {
                return false;
            }
        }

        // Final check that state matches. This feels hacky but the alternative
        // would be checking every state along the branch -- information that isn't available
        // and isn't even generated currently due to optimisations in the matching itself.
        // There are probably cases where this will fail. But missing a few cases is better
        // than getting false positives; and the missed cases can usually be fixed by
        // tweaking routes to be less ambiguous.
        // Hydrate the corresponding leaf of the current branch match, with the state
        // we are navigating to. If they match then this is (almost definitely) active.
        // Need to find the right mapped route that corresponds to the leaf.
        const mappedRoute = this.state.routes.routes.find(
            route => route.route === currentBranch[toBranch.length - 1]
        );
        return hydrateRoute(mappedRoute, this.props.state) === toPath;
    };

    render() {
        return this.props.children || null;
    }
}

export default RoutingProvider;
