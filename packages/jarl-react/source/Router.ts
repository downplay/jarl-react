import { Component, ReactNode } from "react";
import PropTypes from "prop-types";

import routing from "./routing";
import { Location } from "./types";

export interface RouterProps {
    /** A function to render the children of this component */
    children: (location: Location, resolved?: Location) => ReactNode;
    /** @private */
    location?: Location;
    /** @private, injected by the `routing` HOC */
    resolved?: Location;
}

/**
 * Function-as-child API to access current routed location. The current location
 * object and resolved data will be passed to a child callback.
 */
export class Router extends Component<RouterProps> {
    static propTypes = {
        children: PropTypes.func.isRequired,
        location: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    render() {
        return this.props.children(this.props.location!, this.props.resolved);
    }
}

export default routing<RouterProps>(
    (location: Location) => ({ location }),
    null,
    (resolved: Location) => ({ resolved })
)(Router);
