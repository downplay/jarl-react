import UrlPattern from "url-pattern";

const trimRegex = /(^\/+|$\/+)/g;
const trimSlashes = segment => segment.replace(trimRegex, "");
const joinPaths = (...paths) => `/${paths.map(trimSlashes).join("/")}`;

class RouteMapper {
    routes = [];

    constructor(routes = []) {
        this.mapPatterns(routes);
    }

    mapPatterns(routes, parent) {
        // Instance the pattern and store the route
        for (const route of routes) {
            const path = parent
                ? joinPaths(parent.path, route.path)
                : route.path;
            const mappedRoute = {
                ...route,
                path,
                parent,
                state: route.state || {},
                pattern: new UrlPattern(path)
            };
            this.routes.push(mappedRoute);
            // Flatten nested routes
            if (route.routes) {
                this.mapPatterns(route.routes, mappedRoute);
            }
        }
    }

    /**
     * Matches the path recursively against the route definitions
     * @param {string} path
     */
    match(path) {
        let state = {};
        const branch = [];

        const reduceState = route => {
            state = { ...route.state, ...state };
            if (route.parent) {
                reduceState(route.parent);
            }
        };

        for (const route of this.routes) {
            const match = route.pattern.match(path);
            if (match) {
                // Got a match, apply new state over collected state
                // TODO: Handle state funcs, auth
                branch.push({ route, match });
                state = { ...state, ...route.state, ...match };
                if (route.parent) {
                    reduceState(route.parent);
                }
                break;
            }
        }
        return { branch, state };
    }

    /**
     * Resolves the supplied state to a URL
     *
     * @param {*} state
     */
    resolve(state, current) {
        for (const route of this.routes) {
            // TODO: invoke functions
            //       Does resolve potentially become asynchronous?
            if (route.resolve) {
                route.resolve(state, current);
            }
            const keyMap = {};
            const setKeys = key => {
                keyMap[key] = true;
            };
            const populateKeys = resolver => {
                Object.keys(resolver.state).forEach(setKeys);
                resolver.pattern.names.forEach(setKeys);
                if (resolver.parent) {
                    populateKeys(resolver.parent);
                }
            };
            populateKeys(route);
            let ok = true;
            const routeResolvesKey = (resolver, key, value) => {
                if (
                    (key in resolver.state && resolver.state[key] === value) ||
                    resolver.pattern.names.indexOf(key) >= 0
                ) {
                    return true;
                }
                if (resolver.parent) {
                    return routeResolvesKey(resolver.parent, key, value);
                }
                return false;
            };
            for (const key of Object.keys(state)) {
                if (routeResolvesKey(route, key, state[key])) {
                    keyMap[key] = false;
                } else {
                    ok = false;
                    break;
                }
            }
            if (ok && !Object.keys(keyMap).some(key => keyMap[key])) {
                return route.pattern.stringify(state);
            }
        }
        return null;
    }
}

export default RouteMapper;
