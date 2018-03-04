import React, { Component } from "react";
import PropTypes from "prop-types";

import { navigationContextShape } from "./NavigationProvider";

/**
 * Renders an anchor linking to a location. Clicking will cause a navigation via history.
 */
class Link extends Component {
    static propTypes = {
        /** The location object (or path string) to link to. */
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        /**
         * Additional CSS class to be applied when this link is "active" - defined as being either the
         * current page or one of its ancestors, as defined by the RouteMap.
         */
        activeClassName: PropTypes.string,
        /**
         * Additional handler to be called when this link is clicked, before navigation is triggered.
         * Call `event.preventDefault()` to cancel navigation.
         */
        onClick: PropTypes.func,
        /** Provides access to the `ref` of the underlying rendered DOM node or other component */
        innerRef: PropTypes.func,
        /** If true, the current URL will be replaced, rather than creating a new history entry. */
        redirect: PropTypes.bool,
        /**
         * Elements to be rendered as the link text, or a function to override the entire rendering
         * of the link using the function-as-child pattern. The function will receive `href`, `onClick`
         * and `active` props.
         */
        children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        /** Specify a different component to render instead of `a`. Ignored when children is a function. */
        element: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    };

    static defaultProps = {
        to: null,
        activeClassName: "",
        onClick: null,
        redirect: false,
        children: null,
        innerRef: null,
        element: "a"
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
            // TODO: Test innerRef
            innerRef,
            element: Element,
            redirect,
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
        return (
            <Element
                {...others}
                href={href}
                onClick={handleClick}
                className={combinedClassNames}
                ref={innerRef}
            >
                {children}
            </Element>
        );
    }
}

export default Link;
