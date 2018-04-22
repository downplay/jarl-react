import { Component } from "react";
import PropTypes from "prop-types";

import routing from "./routing";

/**
 * Function-as-child API to access current routed location. The current location
 * object and resolved data will be passed to a child callback.
 */
export class Router extends Component {
    static propTypes = {
        /** A function to render the children of this component */
        children: PropTypes.func.isRequired,
        /** @private */
        location: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    render() {
        return this.props.children(this.props.location, this.props.resolved);
    }
}

export default routing(location => ({ location }), null, resolved => ({
    resolved
}))(Router);
