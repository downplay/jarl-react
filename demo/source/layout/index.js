import React, { Fragment } from "react";
import styled from "react-emotion";
import Helmet from "react-helmet";

import { withActive, Link } from "jarl-react";

const PageElement = styled.article``;
export const Page = ({ children }) => (
    <PageElement data-test="page">{children}</PageElement>
);

const HeaderElement = styled.h1``;

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

export const Menu = ({ children }) => (
    <nav>
        <ul>{children}</ul>
    </nav>
);

export const MenuItem = withActive()(({ children, to, active, ...others }) => (
    <li {...others} data-test-active={active}>
        <Link to={to}>{children}</Link>
    </li>
));

export const Layout = styled.div``;
