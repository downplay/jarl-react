import React from "react";

import { Page, Header, Body, Menu, MenuItem } from "../layout";

// TODO: Fix why this doesn't work without `all`
const toDemo = demoName => ({ page: "demo", demoName, all: {} });

const demos = [
    {
        name: "Basic Routing",
        to: toDemo("basicRouting")
    },
    {
        name: "Query Strings",
        to: toDemo("queryStrings")
    },
    {
        name: "Advanced Routing",
        to: toDemo("advancedRouting")
    },
    {
        name: "Redirects",
        to: toDemo("redirects")
    },
    {
        name: "Redux Integration",
        to: toDemo("reduxIntegration")
    }
];

const Index = () => (
    <Page>
        <Header>JARL Demos Index</Header>
        <Body>
            <Menu>
                {demos.map(({ name, to }) => (
                    <MenuItem key={name} to={to}>
                        {name}
                    </MenuItem>
                ))}
            </Menu>
        </Body>
    </Page>
);

export default Index;
