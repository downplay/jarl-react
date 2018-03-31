import React from "react";
import { Subhead } from "rebass-emotion";
import Markdown from "react-remarkable";

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
            {apiContent[apiName].map(({ name, api }) => (
                <article>
                    <Subhead>{name}</Subhead>
                    <Markdown source={api} />
                </article>
            ))}
        </Body>
    </Page>
);

export default Api;
