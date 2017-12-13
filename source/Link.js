import React, { Component } from "react";
import PropTypes from "prop-types";

import { navigationContextShape } from "./NavigationProvider";

const Element = "a";

export default class Link extends Component {
    static propTypes = {
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        activeClassName: PropTypes.string,
        onClick: PropTypes.func
    };

    static defaultProps = {
        to: null,
        activeClassName: "",
        onClick: null
    };

    static contextTypes = {
        navigationContext: navigationContextShape
    };

    handleClick = e => {
        e.preventDefault();
        if (this.props.onClick) {
            // TODO: Return false to cancel navigation?
            this.props.onClick(e);
        }
        this.context.navigationContext.navigate(this.resolveUrl(this.props.to));
    };

    // TODO: memoize for better performance?
    resolveUrl = state => this.context.navigationContext.resolve(state);

    render() {
        const {
            children,
            to,
            activeClassName,
            className,
            ...others
        } = this.props;
        const combinedClassNames =
            activeClassName &&
            this.context.navigationContext.isActive(this.props.to)
                ? `${className} ${activeClassName}`
                : className;
        const href = typeof to === "string" ? to : this.resolveUrl(to);
        return (
            <Element
                href={href}
                onClick={to && this.handleClick}
                {...others}
                className={combinedClassNames}
            >
                {children}
            </Element>
        );
    }
}
