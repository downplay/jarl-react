import React from "react";
import PropTypes from "prop-types";
import { Link as HtmlLink } from "jarl-react";
import { View, TouchableHighlight } from "react-native";

/**
 * Renders a link to a location. By default renders a TouchableHighlight, but
 * a different element can be rendered by using the `element` prop, and
 * rendering can be completely overtaken using the function-as-child pattern.
 */
const Link = ({
    to,
    redirect,
    onClick,
    innerRef,
    children,
    element: Element,
    style,
    activeStyle,
    ...rest
}) => (
    <HtmlLink {...{ to, redirect, onClick }}>
        {typeof children === "function"
            ? children
            : ({ onClick: onLinkClick, isActive }) => (
                  <Element
                      ref={innerRef}
                      onClick={onLinkClick}
                      style={[style, isActive && activeStyle]}
                      {...rest}
                  >
                      {/* If this isn't wrapped in a view, it'll error in the simple case
                          of a text string, since it needs exactly 1 child */}
                      <View>{children}</View>
                  </Element>
              )}
    </HtmlLink>
);

// Note: Most of these propTypes are duplicated verbatim from `jarl-react/Link`. There
// is no default way to handle this in react-docgen but maybe a workaround is possible.
// Tracking issue here: https://github.com/reactjs/react-docgen/issues/33

Link.propTypes = {
    /** The location object (or path string) to link to. */
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
    /** Specify a different component to render instead of `TouchableHighlight`. Ignored when children is a function. */
    element: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    /** Base style to be applied to the rendered element */
    style: PropTypes.object,
    /** Additional styles to apply when this link is active */
    activeStyle: PropTypes.object
};

Link.defaultProps = {
    to: null,
    onClick: null,
    redirect: false,
    children: null,
    innerRef: null,
    element: TouchableHighlight,
    style: {},
    activeStyle: {}
};

export default Link;
