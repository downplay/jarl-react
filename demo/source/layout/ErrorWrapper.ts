import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorWrapperProps {
    onError: (error: Error, info: ErrorInfo) => void;
    children?: ReactNode;
}

class ErrorWrapper extends Component<ErrorWrapperProps> {
    componentDidCatch(error: Error, info: ErrorInfo): void {
        this.props.onError(error, info);
    }

    render() {
        return this.props.children;
    }
}

export default ErrorWrapper;
