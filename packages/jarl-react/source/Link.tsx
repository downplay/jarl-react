import React, { Component, ReactNode, MouseEvent } from "react";
import PropTypes from "prop-types";

import { routingContextShape } from "./RoutingProvider";
import safeJsonStringify from "./lib/safeJsonStringify";
import { Location } from "./types";

export interface LinkRenderProps {
    active?: boolean;
    href?: string;
    onClick?: (e: MouseEvent) => void;
}

export interface LinkProps {
    /** The location object (or path string) to link to. */
    to?: Location | string | null;
    /**
     * Additional CSS class to be applied when this link is "active" - defined as being either the
     * current page or one of its ancestors, as defined by the RouteMap.
     */
    activeClassName?: string;
    /** Additional CSS class(es) always applied to the rendered element. */
    className?: string;
    /**
     * Additional handler to be called when this link is clicked, before navigation is triggered.
     * Call `event.preventDefault()` to cancel navigation.
     */
    onClick?: ((e: MouseEvent) => void) | null;
    /** Provides access to the `ref` of the underlying rendered DOM node or other component */
    innerRef?: ((el: any) => void) | null;
    /** If true, the current URL will be replaced, rather than creating a new history entry. */
    redirect?: boolean;
    /**
     * Elements to be rendered as the link text, or a function to override the entire rendering
     * of the link using the function-as-child pattern. The function will receive `href`, `onClick`
     * and `active` props.
     */
    children?: ReactNode | ((props: LinkRenderProps) => ReactNode);
    /** Specify a different component to render instead of `a`. Ignored when children is a function. */
    element?: React.ElementType | ReactNode;
}

/**
 * Renders an anchor linking to a location. Clicking will cause a navigation via history.
 */
class Link extends Component<LinkProps> {
    static propTypes = {
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        activeClassName: PropTypes.string,
        onClick: PropTypes.func,
        innerRef: PropTypes.func,
        redirect: PropTypes.bool,
        children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
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
        routing: routingContextShape
    };

    // Legacy context API - `this.context` is typed `any` by @types/react here.
    href?: string;

    handleClick = (e: MouseEvent): void => {
        e.preventDefault();
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        this.context.routing.navigate(this.props.to);
    };

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
        let href: string | undefined;
        let active: boolean | undefined = false;
        // Catch issues here and log them rather than blowing up during render
        try {
            href = to ? this.context.routing.stringify(to) : this.href;
            // TODO: PERF: Could be evaluated during stringify? And potentially memoized,
            // as long as we bust the cache when e.g. route table changes.
            // For future refactor: everything would be more efficient if dealing
            // purely in location objects rather than marshalling to and from URLs
            // constantly.
            // Note: Can't reuse the href here as it has the base path added on;
            // ends up with double basepaths otherwise
            active = !!href && this.context.routing.isActive(to);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(
                `JARL: Error trying to render <Link to={${safeJsonStringify(
                    to
                )}}/>.
                ${
                    href
                        ? `\nPath '${href}' was resolved, error was in isActive.`
                        : ""
                }`,
                e
            );
        }
        const handleClick = to ? this.handleClick : undefined;
        // Function-as-child API
        if (typeof children === "function") {
            return children({ active, href, onClick: handleClick });
        }
        // Standard component API
        const combinedClassNames =
            activeClassName && active
                ? `${className} ${activeClassName}`
                : className;
        const ElementType = Element as React.ElementType;
        return (
            <ElementType
                {...others}
                href={href}
                onClick={handleClick}
                className={combinedClassNames}
                ref={innerRef}
            >
                {children}
            </ElementType>
        );
    }
}

export default Link;
