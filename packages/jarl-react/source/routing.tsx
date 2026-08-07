import React, { Component, ComponentType } from "react";

import { routingContextShape } from "./RoutingProvider";
import hocFactory from "./lib/hocFactory";
import { Location } from "./types";

export type NavigateFn = (to: Location | string) => void;
export type RedirectFn = (to: Location | string) => void;
export type StringifyFn = (location: Location) => string;
export type IsActiveFn = (
    locationOrPath: Location | string,
    exact?: boolean
) => boolean;

export interface RoutingCallbacks {
    navigate: NavigateFn;
    redirect: RedirectFn;
    stringify: StringifyFn;
    isActive: IsActiveFn;
}

export type MapLocationCallback<TInjected = any> = (
    location: Location
) => Partial<TInjected>;

export type MapRoutingCallback<TInjected = any, TOwnProps = any> = (
    routing: RoutingCallbacks,
    ownProps: TOwnProps
) => Partial<TInjected>;

export type MapResolvedCallback<TInjected = any> = (
    resolved: Location
) => Partial<TInjected>;

/**
 * Higher-order component to create a router component which receives location data
 * and methods from the RoutingProvider. Injected props are: `location`, `navigate`,
 * `redirect`, `stringify`, `isActive`. See method signature of mapProps for details.
 *
 * `TProps` is the full prop type of the component returned by this HOC (i.e. what
 * external callers must supply) - it is intentionally a separate type parameter
 * from the individual mapping callbacks' injected-prop types, since in practice
 * `mapLocationToProps`/`mapRoutingToProps`/`mapResolvedToProps` often inject
 * disjoint (non-overlapping) subsets of props, which a single shared type
 * parameter can't accurately express. Callers that rely on inference (calling
 * `routing()` with no explicit type arguments, as most of this codebase does) are
 * unaffected; call sites with real prop-shape overlaps between `TProps` and the
 * mapping callbacks (e.g. `Router.ts`) can still pass one explicit `TProps` and
 * let the rest default.
 *
 * @param mapLocationToProps - Function to map location props to your component.
 * If omitted then all properties of location will be spread onto your component.
 * @param mapRoutingToProps - Callback function to map routing props
 * to props that you want to receive on the mapped component.
 * @param mapResolvedToProps - Callback function to map resolved objects
 * to props that you want to receive on the mapped component.
 */
const routing = <
    TProps extends object = any,
    TLocationInjected extends object = any,
    TRoutingInjected extends object = any,
    TResolvedInjected extends object = any
>(
    mapLocationToProps?: MapLocationCallback<TLocationInjected> | null,
    mapRoutingToProps?: MapRoutingCallback<TRoutingInjected, TProps> | null,
    mapResolvedToProps?: MapResolvedCallback<TResolvedInjected> | null
) =>
    hocFactory<TProps>(
        (WrappedComponent: ComponentType<any>) =>
            class Routing extends Component<TProps> {
                static contextTypes = {
                    routing: routingContextShape
                };

                // Legacy context API - typed `any` by @types/react for class components.
                render() {
                    const {
                        isActive,
                        navigate,
                        stringify,
                        redirect,
                        getLocation,
                        getResolved
                    } = this.context.routing;
                    const location = mapLocationToProps
                        ? mapLocationToProps(getLocation())
                        : getLocation();
                    const callbacks = mapRoutingToProps
                        ? mapRoutingToProps(
                              {
                                  isActive,
                                  navigate,
                                  stringify,
                                  redirect
                              },
                              this.props
                          )
                        : {};
                    const resolved = mapResolvedToProps
                        ? mapResolvedToProps(getResolved())
                        : getResolved();

                    // TODO: PERF: See if any caching could/should be done of the
                    // result of mapping functions
                    return (
                        <WrappedComponent
                            {...this.props}
                            {...location}
                            {...resolved}
                            {...callbacks}
                        />
                    );
                }
            }
    );

export default routing;
