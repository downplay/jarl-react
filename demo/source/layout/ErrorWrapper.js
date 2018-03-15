import { Component } from "react";

class ErrorWrapper extends Component {
    componentDidCatch(error, info) {
        this.props.onError(error, info);
    }

    render() {
        return this.props.children;
    }
}

export default ErrorWrapper;
