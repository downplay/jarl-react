import React, { Component } from "react";
import PropTypes from "prop-types";

import { navigationContextShape } from "./NavigationProvider";

const Element = "a";

export default class Link extends Component {
    static propTypes = {
        activeClassName: PropTypes.string
    };

    static defaultProps = {
        to: null,
        href: null,
        activeClassName: ""
    };

    static contextTypes = {
        navigationContext: navigationContextShape
    };

    handleClick = e => {
        e.preventDefault();
        this.context.navigationContext.navigate(this.resolveUrl(this.props.to));
    };

    // TODO: memoize for better performance?
    resolveUrl = state => this.context.navigationContext.resolve(state);

    render() {
        const { children, to, href, activeClassName, ...others } = this.props;
        let className = this.props.className;
        if (
            activeClassName &&
            this.context.navigationContext.isActive(this.props.to)
        ) {
            className = `${className} ${activeClassName}`;
        }
        return (
            <Element
                href={to ? this.resolveUrl(to) : href}
                onClick={to && this.handleClick}
                {...others}
                className={className}
            >
                {children}
            </Element>
        );
    }
}
