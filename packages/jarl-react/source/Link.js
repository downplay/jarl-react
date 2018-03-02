import React, { Component } from "react";
import PropTypes from "prop-types";

import { navigationContextShape } from "./NavigationProvider";

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
            component,
            ...others
        } = this.props;
        // Determine href and active status
        const href = to ? this.stringifyUrl(to) : this.href;
        // TODO: PERF: Could be evaluated during stringify?
        // Note: It is slightly more efficient to check isActive based on
        // the href rather than to, otherwise it just gets stringified again
        const active = this.context.navigationContext.isActive(href);
        const handleClick = to && this.handleClick;
        // Function-as-child API
        if (typeof children === "function") {
            return children({ active, href, onClick: handleClick });
        }
        // Standard component API
        const combinedClassNames =
            activeClassName && active
                ? `${className} ${activeClassName}`
                : className;
        const Element = component || "a";
        return (
            <Element
                {...others}
                href={href}
                onClick={handleClick}
                className={combinedClassNames}
            >
                {children}
            </Element>
        );
    }
}
