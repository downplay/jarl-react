import React, { Component } from "react";
import RoutingProvider from "../es/index";

class TransitionRouter extends Component {
    handleChange = ({ route, branch }) => {
        // Beginning a transition between two routes
    };

    render() {
        return (
            <RoutingProvider onChange={this.handleChange}>
                {this.props.children}
            </RoutingProvider>
        );
    }
}

export default TransitionRouter;
