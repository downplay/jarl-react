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
            this.routes.push({
                ...route,
                path,
                parent,
                pattern: new UrlPattern(path)
            });
            // Flatten nested routes
            if (route.routes) {
                this.mapPatterns(route.routes, route);
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
                // TODO: Handle state funcs, support fragments properly, auth
                branch.push({ route, match });
                state = { ...state, ...route.state, ...match };
                if (route.parent) {
                    reduceState(route.parent);
                }
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
            // TODO: Deep compare, invoke functions
            //       Does resolve potentially become asynchronous?
            if (route.resolve) {
                route.resolve(state, current);
            }
            let keys = Object.keys(route.state);
            let ok = true;
            const entries = Object.entries(state);
            for (const [key, value] of entries) {
                if (
                    (key in route.state && route.state[key] === value) ||
                    route.pattern.names.indexOf(key) >= 0
                ) {
                    keys = keys.filter(k => k !== key);
                } else {
                    ok = false;
                    break;
                }
            }
            if (ok && keys.length === 0) {
                return route.pattern.stringify(state);
            }
        }
        return null;
    }
}

export default RouteMapper;
