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
 * @callback mapPropsCallback
 * @param {Object} routing - The collection of routing properties
 * @param {Object} routing.location - The location object for the current route
 * @param {navigateCallback} routing.navigate - Navigate to a location using history.push
 * @param {redirectCallback} routing.redirect - Redirect to a location using history.replace
 * @param {stringifyCallback} routing.stringify - Serialize a location object into a path
 * @param {isActiveCallback} routing.isActive - Determine whether a location is active.
 * Typically used to render links or other UI elements with a highlighted style when they
 * link to the current page or one of its parent routes.
 * @param {Object} ownProps - The props passed to the component as rendered
 */

/**
 * Higher-order component to create a router component which receives location data
 * and methods from the RoutingProvider. Injected props are: `location`, `navigate`,
 * `redirect`, `stringify`, `isActive`. See method signature of mapProps for details.
 *
 * @param {mapPropsCallback} [mapProps] - Callback function to map routing props
 * to props that you want to receive on the mapped component.
 */
const routing = mapProps =>
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
                        getLocation
                    } = this.context.routing;
                    const props = {
                        isActive,
                        navigate,
                        stringify,
                        redirect,
                        location: getLocation()
                    };
                    // TODO: PERF: See if any caching should be done of the
                    // result of mapProps
                    return (
                        <WrappedComponent
                            {...this.props}
                            {...(mapProps
                                ? mapProps(props, this.props)
                                : props)}
                        />
                    );
                }
            }
    );

export default routing;
