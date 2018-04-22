import React, { Component } from "react";

import { routingContextShape } from "./RoutingProvider";
import hocFactory from "./lib/hocFactory";

/**
 * @callback navigateCallback
 * @param {Object|string} to - The location object or path to navigate to
 */

/**
 * @callback redirectCallback
 * @param {Object|string} to - The location object or path to redirect to
 */

/**
 * @callback stringifyCallback
 * @param {Object} location - The location object to generator a URL for
 * @returns {string} The URL path represented by the location
 */

/**
 * @callback isActiveCallback
 * @param {Object|string} locationOrPath - The location object or path to test
 * @param {boolean} [exact=true] - Whether to test exactly or also test parent routes
 * @returns {boolean} Whether the location is active currently
 */

/**
 * @callback mapRoutingCallback
 * @param {Object} routing - The collection of routing properties
 * @param {navigateCallback} routing.navigate - Navigate to a location using history.push
 * @param {redirectCallback} routing.redirect - Redirect to a location using history.replace
 * @param {stringifyCallback} routing.stringify - Serialize a location object into a path
 * @param {isActiveCallback} routing.isActive - Determine whether a location is active.
 * Typically used to render links or other UI elements with a highlighted style when they
 * link to the current page or one of its parent routes.
 * @param {Object} ownProps - The props passed to the component as rendered
 * @returns {Object} The props to be passed to your component
 */

/**
 * @callback mapLocationCallback
 * @param {Object} location - The current location object
 * @returns {Object} The props to be passed to your component
 */

/**
 * @callback mapResolvedCallback
 * @param {Object} resolved - The object resolved in the most recent routing
 * @returns {Object} The props to be passed to your component
 */

/**
 * Higher-order component to create a router component which receives location data
 * and methods from the RoutingProvider. Injected props are: `location`, `navigate`,
 * `redirect`, `stringify`, `isActive`. See method signature of mapProps for details.
 *
 * @param {mapLocationCallback} [mapLocationToProps] - Function to map location props to your component.
 * If omitted then all properties of location will be spread onto your component.
 * @param {mapRoutingCallback} [mapRoutingToProps] - Callback function to map routing props
 * to props that you want to receive on the mapped component.
 * @param {mapResolvedCallback} [mapResolvedToProps] - Callback function to map resolved objects
 * to props that you want to receive on the mapped component.
 */
const routing = (mapLocationToProps, mapRoutingToProps, mapResolvedToProps) =>
    hocFactory(
        WrappedComponent =>
            class Routing extends Component {
                static contextTypes = {
                    routing: routingContextShape
                };
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
