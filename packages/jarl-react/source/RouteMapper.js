import qs from "qs";
import UrlPattern from "./lib/url-pattern";
import { constants } from "fs";

// Removes any double slashes
const removeSlashDupes = path => path.replace(/\/\/+/g, "/");
// Maybe remove the trailing slash from the end
const removeTrailingSlash = path =>
    path.length > 1 ? path.substring(0, path.length - 1) : path;
// Join together any number of URL path segments and preserve consistent slashes
export const joinPaths = (...paths) =>
    removeTrailingSlash(removeSlashDupes(`/${paths.join("/")}/`));

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
        route.pattern.names.indexOf(key) >= 0 ||
        Object.hasOwnProperty.call(route.query, key)
    ) {
        return true;
    }
    if (route.parent) {
        return routeResolvesKey(route.parent, key, value);
    }
    return false;
};

const splitPath = path => {
    const split = path.split("?");
    if (split.length > 2) {
        throw new Error(
            `Path may only contain one query string delimiter: ${path}`
        );
    }
    return [split[0], split[1] ? qs.parse(split[1]) : {}];
};

function areEqualShallow(a, b) {
    for (const key in a) {
        if (!(key in b) || a[key] !== b[key]) {
            return false;
        }
    }
    for (const key in b) {
        if (!(key in a) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

const matchQuery = (pattern, query) => {
    // Shallow equality only for now
    if (!areEqualShallow(pattern, query)) {
        return null;
    }
    return query;
};

class RouteMapper {
    routes = [];

    constructor(routes = []) {
        this.mapPatterns(routes);
    }

    mapPatterns(routes, parent) {
        // Instance the pattern and store the route
        for (const route of routes) {
            const [childPath, childQuery] = splitPath(route.path);

            const path = parent ? joinPaths(parent.path, childPath) : childPath;
            const query = parent
                ? { ...parent.query, ...childQuery }
                : childQuery;
            // Make sure we resolve right up the parent hierarchy
            let resolve = route.resolve || (parent && parent.resolve);
            if (route.resolve && parent) {
                resolve = state => {
                    const result = parent.resolve(state);
                    if (result === false) {
                        return false;
                    }
                    return { ...result, ...route.resolve(state) };
                };
            }
            // No-op resolve
            if (!resolve) {
                resolve = () => ({});
            }
            const mappedRoute = {
                ...route,
                route,
                path,
                parent,
                query,
                resolve,
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
    match(fullPath) {
        let state = null;
        const branch = [];

        const [path, query] = splitPath(fullPath);
        const reduceState = route => {
            state = { ...state, ...route.state };
            if (route.parent) {
                reduceState(route.parent);
            }
        };

        for (const route of this.routes) {
            const pathMatch = route.pattern.match(path);
            const queryMatch = matchQuery(route.query, query);
            if (pathMatch && queryMatch) {
                // Got a match, compile state from what we know
                const decoded = {};
                for (const key of Object.keys(pathMatch)) {
                    decoded[key] = decodeURIComponent(pathMatch[key]);
                }
                // TODO: Handle state funcs, auth
                state = { ...route.state, ...decoded };
                if (route.parent) {
                    reduceState(route.parent);
                }

                // Call any additional resolution logic
                const resolved = route.resolve(decoded);

                if (resolved) {
                    state = { ...state, ...resolved };
                    branch.push({ route: route.route, match: decoded });
                    return {
                        branch,
                        state: { ...route.state, ...state, ...resolved }
                    };
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
                const pathPart = route.pattern.stringify(state);
                const queryPart = qs.stringify(route.query, state);
                return queryPart ? `${pathPart}?${queryPart}` : pathPart;
            }
        }
        return null;
    }
}

export default RouteMapper;
