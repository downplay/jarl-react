import React, { Fragment } from "react";
import { Subhead } from "rebass-emotion";
import Markdown from "react-remarkable";

import { Page, Header, Body, Menu, MenuItem } from "../layout";

import apiContent from "../docs/api";

// console.log(apiContent);
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

const ComponentApi = ({ item }) => (
    <Fragment>
        <h3>Props</h3>
        <table>
            {item.props &&
                Object.entries(item.props).map(([name, prop]) => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td>{prop.type.name}</td>
                        <td>{prop.defaultValue && prop.defaultValue.value}</td>
                        <td>{prop.required && "required"}</td>
                        <td>{prop.description}</td>
                    </tr>
                ))}
        </table>
        <h3>Details</h3>
        {Paragraph(item.description)}
    </Fragment>
);

// eslint-disable-next-line react/no-array-index-key
const Row = ({ cells }) => cells.map((cell, i) => <td key={i}>{cell}</td>);

const ClassApi = ({ item }) => (
    <Fragment>
        <h3>Constructor</h3>
        <table>
            {item.params.map(({ title, name, default: def, description }) => (
                <Row cells={[title, name, def, description]} />
            ))}
        </table>
    </Fragment>
);

const renderItem = item => {
    switch (item.kind) {
        case "component":
            return <ComponentApi item={item} />;
        case "class":
            return <ClassApi item={item} />;
        default:
            return <pre>{JSON.stringify(item, null, "  ")}</pre>;
    }
};

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
                    {renderItem(item)}
                </article>
            ))}
        </Body>
    </Page>
);

export default Api;
