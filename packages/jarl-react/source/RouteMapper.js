import qs from "qs";
import UrlPattern from "./lib/url-pattern";

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

const isUrlPattern = pattern => pattern.match && pattern.stringify;

const routeResolvesKey = (route, key, value) => {
    if (
        (key in route.state && route.state[key] === value) ||
        // Check in main URL pattern
        route.pattern.names.indexOf(key) >= 0 ||
        // Check in any query pattern
        Object.values(route.query).some(
            q => isUrlPattern(q) && q.names.indexOf(key) >= 0
        )
    ) {
        return true;
    }
    if (route.parent) {
        return routeResolvesKey(route.parent, key, value);
    }
    return false;
};

// TODO: This won't support qs's nested/array queries
const convertToPatterns = query => {
    const patterns = {};
    for (const key of Object.keys(query)) {
        patterns[key] = query[key]
            ? new UrlPattern(`/${query[key]}`)
            : query[key];
    }
    return patterns;
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

const matches = (pattern, value) => {
    if (isUrlPattern(pattern)) {
        return pattern.match(`/${value}`);
    }
    if (pattern === value) {
        return {};
    }
    return false;
};

const matchQuery = (pattern, query) => {
    let state = {};
    for (const key in pattern) {
        if (!(key in query)) {
            return false;
        }
        const match = matches(pattern[key], query[key]);
        if (!match) {
            return false;
        }
        state = { ...state, ...match };
    }
    for (const key in query) {
        if (!(key in pattern) || !matches(pattern[key], query[key])) {
            return false;
        }
        const match = matches(pattern[key], query[key]);
        if (!match) {
            return false;
        }
        state = { ...state, ...match };
    }
    return state;
};

const hydrateQuery = (pattern, state) => {
    const query = {};
    for (const key of Object.keys(pattern)) {
        query[key] = isUrlPattern(pattern[key])
            ? pattern[key].stringify(state).substring(1)
            : pattern[key];
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
            let query = convertToPatterns(childQuery);
            query = parent ? { ...parent.query, ...childQuery } : query;
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
                state = { ...route.state, ...decoded, ...queryMatch };
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
    stringify(state) {
        for (const route of this.routes) {
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
                const queryPart = qs.stringify(
                    hydrateQuery(route.query, state)
                );
                return queryPart ? `${pathPart}?${queryPart}` : pathPart;
            }
        }
        return null;
    }
}

export default RouteMapper;
