import { Component } from "react";
import PropTypes from "prop-types";

import routing from "./routing";

/**
 * Function-as-child API to access current routed location. The current location
 * object will be passed to a children callback.
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
        return this.props.children(this.props.location);
    }
}

export default routing(location => ({ location }))(Router);
