import React from "react";

import { Page, Header, Body, Menu, MenuItem } from "../layout";

const demos = [
    {
        name: "Basic Routing",
        // TODO: Fix why this doesn't work without `all`
        // to: { page: "demo", demoName: "basicRouting", all: {} }
        to: "/basicRouting"
    },
    {
        name: "Query Strings",
        to: "/queryStrings"
    },
    {
        name: "Advanced Routing",
        to: "/advamcedRouting"
    },
    {
        name: "Redux Integration",
        to: "/reduxIntegration"
    }
];

const Index = () => (
    <Page>
        <Header>JARL Demos Index</Header>
        <Body>
            <Menu>
                {demos.map(({ name, to }) => (
                    <MenuItem to={to}>{name}</MenuItem>
                ))}
            </Menu>
        </Body>
    </Page>
);

export default Index;
