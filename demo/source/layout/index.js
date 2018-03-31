import React, { Fragment } from "react";
import styled from "react-emotion";
import Helmet from "react-helmet";
import { Lead, NavLink } from "rebass-emotion";

import { Link } from "jarl-react";

export { default as MainLayout } from "./MainLayout";
export { default as Layout } from "./DemoLayout";
export { default as ErrorWrapper } from "./ErrorWrapper";

const PageElement = styled.article`
    background-color: ${props =>
        props.theme ? props.theme.back : "transparent"};
    color: ${props => (props.theme ? props.theme.fore : "transparent")};
`;

export const Page = ({ children }) => (
    <PageElement data-test="page">{children}</PageElement>
);

const HeaderElement = styled.h1`
    color: ${props => (props.theme ? props.theme.fore : "transparent")};
`;

export const Header = ({ children }) => (
    <Fragment>
        <Helmet>
            <title>{children}</title>
        </Helmet>
        <HeaderElement data-test="header">{children}</HeaderElement>
    </Fragment>
);

const BodyElement = styled.div``;

export const Body = ({ children }) => (
    <BodyElement data-test="body">{children}</BodyElement>
);

const Indent = styled.div`
    padding-left: 2rem;
`;

export const Menu = ({ children }) => <nav>{children}</nav>;

// TODO: Test active on all URLs
export const MenuItem = ({ children, to, ...rest }) => (
    <Link to={to}>
        {({ active, onClick, href }) => (
            <NavLink
                {...rest}
                active={active}
                data-test-active={active}
                href={href}
                onClick={onClick}
            >
                {children}
            </NavLink>
        )}
    </Link>
);

export const SubMenu = ({ children, title, ...rest }) => (
    <Fragment>
        <MenuItem {...rest}>{title}</MenuItem>
        <Indent>
            <Menu>{children}</Menu>
        </Indent>
    </Fragment>
);
