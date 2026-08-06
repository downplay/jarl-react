import React, { Fragment, ReactNode } from "react";
import styled from "react-emotion";
import Helmet from "react-helmet";
import { Menu as BaseMenu } from "semantic-ui-react";

import { Link } from "jarl-react";

export { default as MainLayout } from "./MainLayout";
export { default as Layout } from "./DemoLayout";
export { default as ErrorWrapper } from "./ErrorWrapper";

export { default as MarkdownJsx } from "./MarkdownJsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ThemedProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme?: any;
}

const PageElement = styled.article`
    background-color: ${(props: ThemedProps) =>
        props.theme ? props.theme.back : "transparent"};
    color: ${(props: ThemedProps) =>
        props.theme ? props.theme.fore : "transparent"};
`;

export const Page = ({ children }: { children?: ReactNode }) => (
    <PageElement data-test="page">{children}</PageElement>
);

const HeaderElement = styled.h1`
    color: ${(props: ThemedProps) =>
        props.theme ? props.theme.fore : "transparent"};
`;

export const Header = ({ children }: { children?: ReactNode }) => (
    <Fragment>
        <Helmet>
            <title>{children}</title>
        </Helmet>
        <HeaderElement data-test="header">{children}</HeaderElement>
    </Fragment>
);

const BodyElement = styled.div``;

export const Body = ({ children }: { children?: ReactNode }) => (
    <BodyElement data-test="body">{children}</BodyElement>
);

export const Menu = ({ children }: { children?: ReactNode }) => (
    <BaseMenu vertical>{children}</BaseMenu>
);

// `to` mirrors jarl-react's own Link `to` prop (a Location - i.e.
// Record<string, any> - or path string).
interface MenuItemProps {
    children?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    to?: Record<string, any> | string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// TODO: Test active on all URLs
export const MenuItem = ({ children, to, ...rest }: MenuItemProps) => (
    <Link to={to}>
        {({ active, onClick, href }) => (
            <BaseMenu.Item
                {...rest}
                active={active}
                data-test-active={active}
                href={href}
                onClick={onClick}
            >
                {children}
            </BaseMenu.Item>
        )}
    </Link>
);

interface SubMenuProps {
    children?: ReactNode;
    title?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const SubMenu = ({ children, title, ...rest }: SubMenuProps) => (
    <Fragment>
        <BaseMenu.Item header {...rest}>
            {title}
        </BaseMenu.Item>
        <BaseMenu vertical>{children}</BaseMenu>
    </Fragment>
);
