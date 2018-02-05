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
        this.context.navigationContext.navigate(
            this.stringifyUrl(this.props.to)
        );
    };

    // PERF: Could perhaps be memoized. But needs to know if navcontext changed routes table.
    stringifyUrl = state => this.context.navigationContext.stringify(state);

    render() {
        const {
            children,
            to,
            activeClassName,
            className,
            onClick,
            ...others
        } = this.props;
        const combinedClassNames =
            activeClassName &&
            this.context.navigationContext.isActive(this.props.to)
                ? `${className} ${activeClassName}`
                : className;
        const href = this.stringifyUrl(to);
        return (
            <Element
                href={href}
                {...others}
                onClick={to && this.handleClick}
                className={combinedClassNames}
            >
                {children}
            </Element>
        );
    }
}
