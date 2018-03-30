import React from "react";
import { Link as HtmlLink } from "jarl-react";
import { TouchableHighlight } from "react-native";

const Link = ({
    to,
    element,
    innerRef,
    redirect,
    children,
    element: Element = TouchableHighlight,
    style,
    activeStyle,
    ...rest
}) => (
    <HtmlLink to={to}>
        {typeof children === "function"
            ? children
            : ({ onClick, isActive }) => (
                  <Element
                      onClick={onClick}
                      style={[style, isActive && activeStyle]}
                      {...rest}
                  >
                      {children}
                  </Element>
              )}
    </HtmlLink>
);

export default Link;
