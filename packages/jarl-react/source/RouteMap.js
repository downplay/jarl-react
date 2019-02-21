import qs from "qs";
import UrlPattern from "./vendor/url-pattern";
import { Redirect } from "./redirect";

const noop = a => a;

// Removes any double slashes
const removeSlashDupes = path => path.replace(/\/\/+/g, "/");
// Maybe remove the trailing slash from the end
const removeTrailingSlash = path =>
    path.length > 1 ? path.substring(0, path.length - 1) : path;

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

const routeHasKey = (route, key, value) => {
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

// Merges together any number of URL path segments and queries,
// preserving consistent slashes
export const joinPaths = (...paths) => {
    let joined = "";
    let merged = {};
    paths.forEach(path => {
        const [segment, query] = splitPath(path);
        joined = `${joined}/${segment}`;
        merged = { ...merged, ...query };
    });
    const mergedKeys = Object.keys(merged);
    return (
        removeTrailingSlash(removeSlashDupes(`/${joined}/`)) +
        (mergedKeys.length
            ? `?${mergedKeys.map(key => `${key}=${merged[key]}`).join("&")}`
            : "")
    );
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
    let location = {};
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
        location = { ...location, ...match };
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
            // Normally spread match over location
            location = { ...location, ...match };
        } else {
            // For wildcard case, merge onto a child object
            // TODO: A lot of the special casing (and limitations) of some of
            // the path constructs should disappear, and just traverse the AST
            // manually ourselves, mainly the issues are in checking for optionals, but also
            // processing key names. Then could have scenarios like ':year(-:month(-:day))' both in
            // query strings and in path segments.
            const wildCardKey = getQueryWildcardStateKey(pattern["*"]);
            location = {
                ...location,
                [wildCardKey]: {
                    ...location[wildCardKey],
                    ...{ [key]: match[wildCardKey] }
                }
            };
        }
    }
    return location;
};

const stringifyQueryValue = (location, pattern) =>
    isUrlPattern(pattern) ? pattern.stringify(location).substring(1) : pattern;

const hydrateQuery = (pattern, location) => {
    const query = {};
    for (const key of Object.keys(pattern)) {
        if (key === "*") {
            // If there's a wildcard, merge all captured props onto the query
            const wildKey = getQueryWildcardStateKey(pattern["*"]);
            const rest = location[wildKey];
            if (!rest) {
                continue;
            }
            for (const namedKey of Object.keys(rest)) {
                query[namedKey] = stringifyQueryValue(
                    { [wildKey]: rest[namedKey] },
                    pattern["*"]
                );
            }
        } else {
            // Merge normal property onto query
            const value = stringifyQueryValue(location, pattern[key]);
            if (isOptional(pattern[key]) && !value) {
                continue;
            }
            query[key] = value;
        }
    }
    return query;
};

export const hydrateRoute = (route, location) => {
    const pathPart = route.pattern.stringify(location);
    const queryPart =
        route.query && qs.stringify(hydrateQuery(route.query, location));
    return queryPart ? `${pathPart}?${queryPart}` : pathPart;
};

const unroll = (item, next) =>
    item ? [...unroll(next(item), next), item.route] : [];

const unrollBranch = route => unroll(route, r => r.parent);

// TODO: This class should be broken down into functional parser components
// It's too big and unwieldy to debug effectively now

/**
 * Performs the core logic of the router: matching paths and transforming then into
 * location objects, and inversely taking location objects and serializing them into
 * path strings.
 *
 * May be passed into the `routes` prop of a RoutingProvider to configure your app.
 *
 * @param {Array<Route>} routes - an array of {Route} definitions to match against
 */
class RouteMap {
    routes = [];

    constructor(routes = []) {
        this.mapPatterns(routes);
    }

    /**
     * @privates
     */
    mapPatterns(routes, parent) {
        // Instance the pattern and store the route
        routes.forEach(route => {
            const [childPath, childQuery] = splitPath(route.path);
            const path = parent ? joinPaths(parent.path, childPath) : childPath;
            let query = convertToPatterns(childQuery);
            query = parent ? { ...parent.query, ...query } : query;
            // Take either this matcher or the parent's one
            let match = route.match || (parent && parent.match);
            // But if both existed compose them together
            if (route.match && parent) {
                match = (location, context) => {
                    const result = parent.match(location, context);
                    // Redirects and false returns will override any child routes
                    if (result === false || result instanceof Redirect) {
                        return result;
                    }
                    return route.match(result, context);
                };
            }
            // No-op match
            if (!match) {
                match = noop;
            }
            // Apply a similar reduction to stringify but bottom-up
            let stringify = route.stringify || (parent && parent.stringify);
            if (route.stringify && parent) {
                stringify = (location, context) => {
                    const result = route.stringify(location, context);
                    if (result === false) {
                        return false;
                    }
                    return parent.stringify(result, context);
                };
            }
            if (!stringify) {
                stringify = noop;
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
                stringify,
                state,
                pattern: path ? new UrlPattern(path) : null
            };
            this.routes.push(mappedRoute);
            // Flatten nested routes
            if (route.routes) {
                this.mapPatterns(route.routes, mappedRoute);
            }
        });
    }

    /**
     * Performs matching of the url against the route table. Will check each route's path and query
     * definitions for a successful pattern match. If they match, then any `match` callback on the
     * route will also executed. If the callback returns falsy then that route will not be matched
     * and matching will continue with the next route. Otherwise, the `state` object from the route
     * will be combined with any matched path tokens as well as anything returned from the `match`
     * callback, into a final `location` object.
     * This will be returned along with the 'branch' (an array of the routes along which matching
     * occurred), in the form `{ location, branch }`.
     *
     * @param {string} url - the path and querystring to be matched
     * @param {object} context - an optional context object to be passed into any `match` callbacks
     */
    match(url, context = {}) {
        const [path, query] = splitPath(url);
        for (const route of this.routes) {
            const pathMatch = route.pattern && route.pattern.match(path);
            const queryMatch = matchQuery(route.query, query);

            if (pathMatch && queryMatch) {
                // Got a match, compile location from what we know
                const decoded = {};
                // Decode special characters in pattern URI components; query strings
                // are already decoded in matchQuery
                for (const key of Object.keys(pathMatch)) {
                    decoded[key] = decodeURIComponent(pathMatch[key]);
                }
                const location =
                    route.state instanceof Redirect
                        ? route.state
                        : { ...route.state, ...decoded, ...queryMatch };
                // Call any additional matching logic
                // Note: Matchers can still affect the redirect from state
                const matched = route.match(location, context);
                if (matched) {
                    return {
                        branch: unrollBranch(route),
                        location: matched
                    };
                }
            }
        }
        return { branch: [], location: null };
    }

    /**
     * Serializes the supplied object to a URL
     *
     * @param {Object} location - the location object to generate a URL for
     * @param {callback} context - outside context provided to stringifiers
     *
     * TODO: Some tests on context and passing it to stringify
     */
    stringify(location, context = {}) {
        for (const route of this.routes) {
            // TODO: Consider that patternless routes
            // don't actually need to be in the route map
            if (!route.pattern) {
                continue;
            }
            const keyMap = {};
            populateKeys(keyMap, route);
            // Perform additional stringification transform
            let locationToCheck = location;
            if (route.stringify) {
                const stringState = route.stringify(locationToCheck, context);
                if (!stringState) {
                    continue;
                }
                locationToCheck = stringState;
            }
            let ok = true;
            // Now test against any route params we're aware of
            for (const key of Object.keys(locationToCheck)) {
                if (routeHasKey(route, key, locationToCheck[key])) {
                    keyMap[key] = false;
                } else {
                    ok = false;
                    break;
                }
            }
            if (ok && !Object.keys(keyMap).some(key => keyMap[key])) {
                return hydrateRoute(route, locationToCheck);
            }
        }
        return null;
    }
}

export default RouteMap;
