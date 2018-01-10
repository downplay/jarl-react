import UrlPattern from "./lib/url-pattern";

const trimRegex = /(^\/+|$\/+)/g;
const trimSlashes = segment => segment.replace(trimRegex, "");
const joinPaths = (...paths) => `/${paths.map(trimSlashes).join("/")}`;

const populateKeys = (keyMap, route) => {
    const setKey = key => {
        keyMap[key] = true;
    };
    Object.keys(route.state).forEach(setKey);
    route.pattern.names.forEach(setKey);
    if (route.parent) {
        populateKeys(keyMap, route.parent);
    }
};

const routeResolvesKey = (route, key, value) => {
    if (
        (key in route.state && route.state[key] === value) ||
        route.pattern.names.indexOf(key) >= 0
    ) {
        return true;
    }
    if (route.parent) {
        return routeResolvesKey(route.parent, key, value);
    }
    return false;
};

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
                route,
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
        let state = null;
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
                const decoded = {};
                for (const key of Object.keys(match)) {
                    decoded[key] = decodeURIComponent(match[key]);
                }
                // TODO: Handle state funcs, auth
                branch.push({ route: route.route, match: decoded });
                state = { ...route.state, ...decoded };
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
    stringify(state, current) {
        for (const route of this.routes) {
            // TODO: invoke functions
            //       Does stringify potentially become asynchronous?
            if (route.resolve) {
                route.resolve(state, current);
            }
            const keyMap = {};
            populateKeys(keyMap, route);
            let ok = true;
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
