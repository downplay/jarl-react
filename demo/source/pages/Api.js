import React, { Fragment } from "react";
import { Subhead } from "rebass-emotion";
import Markdown from "react-remarkable";

import { Page, Header, Body, Menu, MenuItem } from "../layout";

import apiContent from "../docs/api";

const toApi = apiName => ({ page: "api", apiName });

const apis = [
    {
        name: "JARL",
        to: toApi("jarl-react")
    }
];

const Paragraph = text => (
    // eslint-disable-next-line react/no-danger
    <p dangerouslySetInnerHTML={{ __html: text.split("\n\n").join("<br/>") }} />
);

const Line = line => (
    <Fragment>
        {typeof line === "string" && <Markdown source={line} />}
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
            {apiContent[apiName].map(item => (
                <article key={item.displayName || item.name}>
                    <Subhead>{item.displayName || item.name}</Subhead>
                    {Line(item.description)}
                </article>
            ))}
        </Body>
    </Page>
);

export default Api;
