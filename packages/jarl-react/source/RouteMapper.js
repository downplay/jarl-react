import qs from "qs";
import UrlPattern from "./lib/url-pattern";
import { Redirect } from "./redirect";

// Removes any double slashes
const removeSlashDupes = path => path.replace(/\/\/+/g, "/");
// Maybe remove the trailing slash from the end
const removeTrailingSlash = path =>
    path.length > 1 ? path.substring(0, path.length - 1) : path;
// Join together any number of URL path segments and preserve consistent slashes
export const joinPaths = (...paths) =>
    removeTrailingSlash(removeSlashDupes(`/${paths.join("/")}/`));

const isUrlPattern = pattern => pattern && pattern.match && pattern.stringify;

const isOptional = pattern =>
    isUrlPattern(pattern) &&
    pattern.ast.length > 1 &&
    pattern.ast[1].tag === "optional";

const getQueryWildcardStateKey = ({ ast }) => {
    const names = UrlPattern.astNodeToNames(ast);
    return names[0] || "?";
};

const populateKeys = (keyMap, route) => {
    const setKey = key => {
        keyMap[key] = true;
    };
    Object.keys(route.state).forEach(setKey);
    route.pattern.names.forEach(setKey);
    Object.keys(route.query).forEach(key => {
        const q = route.query[key];
        // TODO: Bit of a mess to sort out regarding optional here and above
        if (key === "*" || !isUrlPattern(q) || isOptional(q)) {
            return;
        }
        q.names.forEach(setKey);
    });
};

const routeResolvesKey = (route, key, value) => {
    if (
        (key in route.state && route.state[key] === value) ||
        // Check in main URL pattern
        (route.pattern && route.pattern.names.indexOf(key) >= 0) ||
        // Check in any query pattern
        Object.keys(route.query).some(
            q =>
                isUrlPattern(route.query[q]) &&
                route.query[q].names.indexOf(key) >= 0
        )
    ) {
        return true;
    }
    return false;
};

// TODO: This won't support qs's nested/array queries
// TODO: Also no support for having truthy bool props with no
// equals sign like /foo?boolProp
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

// Some components weren't getting encoded even though they break pattern matching
// (e.g. apostrophes)
// https://stackoverflow.com/questions/18251399/why-doesnt-encodeuricomponent-encode-single-quotes-apostrophes
const rfc3986EncodeURIComponent = str =>
    encodeURIComponent(str).replace(/[!'()*]/g, escape);

const matchQuery = (pattern, query) => {
    let state = {};
    for (const key in pattern) {
        if (!(key === "*" || key in query || isOptional(pattern[key]))) {
            return false;
        }
        if (key === "*" || (isOptional(pattern[key]) && !query[key])) {
            continue;
        }
        // `qs` decodes URI components, need to re-encode them for url-pattern's
        // matching to work properly.
        const match = matches(
            pattern[key],
            rfc3986EncodeURIComponent(query[key])
        );
        if (!match) {
            return false;
        }
        // Decode matched values again
        Object.keys(match).forEach(k => {
            match[k] = decodeURIComponent(match[k]);
        });
        state = { ...state, ...match };
    }

    for (const key in query) {
        if (!(pattern["*"] || key in pattern)) {
            return false;
        }
        if (isOptional(pattern[key]) && !query[key]) {
            continue;
        }
        const match = matches(
            pattern[key in pattern ? key : "*"],
            rfc3986EncodeURIComponent(query[key])
        );
        if (!match) {
            return false;
        }
        Object.keys(match).forEach(k => {
            match[k] = decodeURIComponent(match[k]);
        });
        if (key in pattern) {
            // Normally spread match over state
            state = { ...state, ...match };
        } else {
            // For wildcard case, merge onto a child object
            // TODO: A lot of the special casing (and limitations) of some of
            // the path constructs should disappear, and just traverse the AST
            // manually ourselves, mainly the issues are in checking for optionals, but also
            // processing key names. Then could have scenarios like ':year(-:month(-:day))' both in
            // query strings and in path segments.
            const wildCardKey = getQueryWildcardStateKey(pattern["*"]);
            state = {
                ...state,
                [wildCardKey]: {
                    ...state[wildCardKey],
                    ...{ [key]: match[wildCardKey] }
                }
            };
        }
    }
    return state;
};

const stringifyQueryValue = (state, pattern) =>
    isUrlPattern(pattern) ? pattern.stringify(state).substring(1) : pattern;

const hydrateQuery = (pattern, state) => {
    const query = {};
    for (const key of Object.keys(pattern)) {
        if (key === "*") {
            // If there's a wildcard, merge all captured props onto the query
            const wildKey = getQueryWildcardStateKey(pattern["*"]);
            const rest = state[wildKey];
            for (const namedKey of Object.keys(rest)) {
                query[namedKey] = stringifyQueryValue(
                    { [wildKey]: rest[namedKey] },
                    pattern["*"]
                );
            }
        } else {
            // Merge normal property onto query
            const value = stringifyQueryValue(state, pattern[key]);
            if (isOptional(pattern[key]) && !value) {
                continue;
            }
            query[key] = value;
        }
    }
    return query;
};

const unroll = (item, next) =>
    item ? [...unroll(next(item), next), item.route] : [];

const unrollBranch = route => unroll(route, r => r.parent);

/**
 * Responsible for processing and storying a route table,
 * and performing matching and serialization of URLs
 *
 * TODO: This class should be broken down into functional parser components
 * It's too big and unwieldy to debug effectively now
 */
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
            query = parent ? { ...parent.query, ...query } : query;
            // Take either this matcher or the parent's one
            let match = route.match || (parent && parent.match);
            // But if both existed compose them together
            if (route.match && parent) {
                match = state => {
                    const result = parent.match(state);
                    // Redirects and false returns will override any child routes
                    if (result === false || result instanceof Redirect) {
                        return result;
                    }
                    return { ...result, ...route.match(state) };
                };
            }
            // No-op match
            if (!match) {
                match = state => state;
            }
            // Handle possible redirect state. If the parent was a redirect,
            // throw away, otherwise merge parent state
            // TODO: This seems like an unintended consequence of nesting something
            // under a redirect. State should still be merged from grandparents.
            // It seems inconsistent that we can skip state redirects
            // TODO: Also consider are state redirects just overengineering
            // when all redirect cases can be handled in match regardless
            let { state } = route;
            if (!(state instanceof Redirect)) {
                state =
                    !parent || parent instanceof Redirect
                        ? { ...state }
                        : { ...parent.state, ...state };
            }
            // TODO: Similar reductions as above for both resolve and stringify
            const mappedRoute = {
                ...route,
                route,
                path,
                parent,
                query,
                match,
                state,
                pattern: path ? new UrlPattern(path) : null
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
    match(fullPath, context = {}) {
        const [path, query] = splitPath(fullPath);
        for (const route of this.routes) {
            const pathMatch = route.pattern && route.pattern.match(path);
            const queryMatch = matchQuery(route.query, query);

            if (pathMatch && queryMatch) {
                // Got a match, compile state from what we know
                const decoded = {};
                // Decode special characters in pattern URI components; query strings
                // are already decoded in matchQuery
                for (const key of Object.keys(pathMatch)) {
                    decoded[key] = decodeURIComponent(pathMatch[key]);
                }
                const state =
                    route.state instanceof Redirect
                        ? route.state
                        : { ...route.state, ...decoded, ...queryMatch };
                // Call any additional matching logic
                // Note: Matchers can still affect the redirect from state
                const matched = route.match(state, context);
                if (matched) {
                    return {
                        branch: unrollBranch(route),
                        state: matched
                    };
                }
            }
        }
        return { branch: [], state: null };
    }

    /**
     * Resolves the supplied state to a URL
     *
     * @param {*} state
     */
    stringify(state) {
        for (const route of this.routes) {
            // TODO: Consider that patternless routes
            // don't actually need to be in the route map
            if (!route.pattern) {
                continue;
            }
            const keyMap = {};
            populateKeys(keyMap, route);
            // Perform additional stringification transform
            let checkState = state;
            if (route.stringify) {
                const stringState = route.stringify(state);
                if (!stringState) {
                    continue;
                }
                checkState = stringState;
            }
            let ok = true;
            // Now test against any route state we're aware of
            for (const key of Object.keys(checkState)) {
                if (routeResolvesKey(route, key, checkState[key])) {
                    keyMap[key] = false;
                } else {
                    ok = false;
                    break;
                }
            }
            if (ok && !Object.keys(keyMap).some(key => keyMap[key])) {
                const pathPart = route.pattern.stringify(checkState);
                const queryPart = qs.stringify(
                    hydrateQuery(route.query, checkState)
                );
                return queryPart ? `${pathPart}?${queryPart}` : pathPart;
            }
        }
        return null;
    }
}

export default RouteMapper;
