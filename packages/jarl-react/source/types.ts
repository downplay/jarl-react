import UrlPattern from "./vendor/url-pattern";
import { Redirect } from "./redirect";

/**
 * A location is an open-ended, application-defined bag of state describing "where"
 * the app currently is. Routes decide what keys live on it, so it can't be modelled
 * more precisely than this without generics that this conversion doesn't introduce.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Location = Record<string, any>;

/** Arbitrary outside context passed through to match/stringify/resolve callbacks. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RoutingContext = any;

export type MatchResult = Location | Redirect | false | null | undefined;

export type MatchFn = (
    location: Location,
    context: RoutingContext
) => MatchResult;

export type StringifyFn = (
    location: Location,
    context: RoutingContext
) => Location | false;

export type ResolveFn = (
    location: Location,
    context: RoutingContext
) => Promise<Location | Redirect>;

export type QueryPattern = UrlPattern | string | undefined;

/** A route definition as authored by a consuming application. */
export interface RouteDefinition {
    path: string;
    state?: Location | Redirect;
    query?: Record<string, QueryPattern>;
    match?: MatchFn;
    stringify?: StringifyFn;
    resolve?: ResolveFn;
    routes?: RouteDefinition[];
    // Route definitions may carry arbitrary additional properties (they are spread
    // onto the mapped route) that user-supplied match/stringify/resolve callbacks
    // can make use of.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/** A route definition after being flattened/normalized by RouteMap. */
export interface MappedRoute extends RouteDefinition {
    /** The original route definition this was mapped from. */
    route: RouteDefinition;
    parent?: MappedRoute;
    query: Record<string, QueryPattern>;
    match: MatchFn;
    stringify: StringifyFn;
    state: Location | Redirect;
    pattern: UrlPattern | null;
}

export interface MatchOutcome {
    branch: RouteDefinition[];
    location: Location | Redirect | null;
}
