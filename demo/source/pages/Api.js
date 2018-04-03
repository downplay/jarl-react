import React, { Fragment } from "react";
import { Subhead } from "rebass-emotion";

import { Page, Header, Body, Menu, MenuItem } from "../layout";

import apiContent from "../docs/api";

console.log(apiContent);
const toApi = apiName => ({ page: "api", apiName });

const apis = [
    {
        name: "JARL",
        to: toApi("jarl-react")
    }
];

const stringify = line => <pre>{JSON.stringify(line, null, "  ")}</pre>;

const Paragraph = text => (
    <p dangerouslySetInnerHTML={{ __html: text.split("\n\n").join("<br/>") }} />
);

const Line = line => (
    <Fragment>
        {line.type === "text" && Paragraph(line.value)}
        {line.children && line.children.map(Line)}
    </Fragment>
);

const Api = ({ apiName }) => (
    <Page>
        <Header>JARL API</Header>
        <Body>
            <Menu>
                {apis.map(({ name, to }) => (
                    <MenuItem key={name} to={to}>
                        {name}
                    </MenuItem>
                ))}
            </Menu>
            {apiContent[apiName].map(({ name, description }) => (
                <article key={name}>
                    <Subhead>{name}</Subhead>
                    {Line(description)}
                </article>
            ))}
        </Body>
    </Page>
);

export default Api;
